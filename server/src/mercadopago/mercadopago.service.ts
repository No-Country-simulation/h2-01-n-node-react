import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { Orders } from 'src/orders/orders.entity';
import { Prices } from 'src/prices/prices.entity';
import { USER_ROLE } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MercadopagoService {
  constructor(
    @InjectRepository(Prices)
    private pricesRepository: Repository<Prices>,
    private usersService: UsersService,
    private configSerivce: ConfigService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
  async generatePaymentLink(userId: number, priceId = 1) {
    const mpAccessToken = this.configSerivce.get<string>('mpAccessToken');

    if (!mpAccessToken)
      throw new BadRequestException('Mercadopago access token not found');

    const { user } = await this.usersService.findOneById(userId);

    if (!user) throw new NotFoundException('User not found');
    if (user.role === USER_ROLE.PREMIUM)
      throw new ConflictException('User is already premium');

    const price = await this.pricesRepository.findOne({
      where: { id: priceId },
    });

    if (!price) throw new NotFoundException('Price not found');

    const mercadopago = new MercadoPagoConfig({ accessToken: mpAccessToken });
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: 'message',
            unit_price: parseFloat(`${price.value}`),
            quantity: 1,
            title: 'WAKI Subscripción Premium',
          },
        ],
        metadata: {
          user_id: userId,
        },
      },
    });

    return preference.init_point;
  }

  async createOrder(paymentId: string) {
    const mpAccessToken = this.configSerivce.get<string>('mpAccessToken');

    if (!mpAccessToken)
      throw new BadRequestException('Mercadopago access token not found');

    const mercadopago = new MercadoPagoConfig({ accessToken: mpAccessToken });
    const payment = await new Payment(mercadopago).get({ id: paymentId });

    if (payment.status === 'approved') {
      console.log({ payment });
      await this.entityManager.transaction(
        async (transactionManager: EntityManager) => {
          const existingOrder = await transactionManager.findOne(Orders, {
            where: { id: payment.id },
          });

          if (existingOrder) {
            throw new BadRequestException(
              'Order with this paymentId already exists',
            );
          }

          const newOrder = transactionManager.create(Orders, {
            id: payment.id,
            userId: payment?.metadata?.user_id,
            amount: payment?.transaction_amount || 0,
            detail: 'premium',
          });

          await transactionManager.save(newOrder);

          await this.usersService.upgradeUserToPremium(
            payment?.metadata?.user_id,
            transactionManager,
          );
        },
      );
    }
  }
}
