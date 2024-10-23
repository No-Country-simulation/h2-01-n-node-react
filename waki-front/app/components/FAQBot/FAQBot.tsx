"use client"
import React, {useState} from 'react'
import {Send} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import './faqbot.css'

type Message = {
    text:string
    isUser: boolean
}

const QA = [
    {question:"Hola", answer:"¡Hola, como estas? ¿En que puedo ayudarte?"},
    {question:"Como pago?", answer:"Puedes hacer clic en el boton '+' 😀"},
    {question:"Puedo cancelar mi prediccion?", answer:"NO 😎"},
    {question:"Como hago una predicción?", answer:"Puedes hacer una prediccion desde la pantalla Partidos."},
     {question:"Que metodos de pago aceptan?", answer:"Aceptamos como metodo de pago Visa, Master y Transferencias."},
     {question:"Como hago una trasnferencia", answer:"La transferencia debe hacerse a BBVA N° 5465463.."},
    
]

const PREGUNTAS_PREDEFINIDAS = ["Hola", "Como pago?", "Como hago una predicción?"]
export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = (text: string = input) => {
    if (text.trim() === '') return

    setMessages(prev => [...prev, { text, isUser: true }])

    const response = QA.find(qa => qa.question.toLowerCase() === text.toLowerCase())?.answer || "Lo siento, no entiendo esa pregunta."

    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }])
    }, 500)

    setInput('')
  }

  return (
    <div>
        <div className='titleContainer'>
            <h1 className='titleChat'>Chat whit bot</h1>
        </div>
      <div className="w-full max-w-md mx-auto p-4 bg-background rounded-lg shadow">
      <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? 'bg-violet-500 text-white ml-auto' : 'bg-secondary text-secondary-foreground'
            } max-w-[80%] ${message.isUser ? 'float-right clear-both' : 'float-left clear-both'}`}
          >
            {message.text}
          </div>
        ))}
      </ScrollArea>
      <div className="mb-4 flex flex-wrap gap-2">
        {PREGUNTAS_PREDEFINIDAS.map((question, index) => (
          <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => handleSend(question)}
          className="bg-violet-100 text-violet-700 hover:bg-violet-200"
        >
          {question}
        </Button>

        ))}
        </div>
      <div className="flex gap-2">
      <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu pregunta aquí..."
          className="flex-grow"/>
        <Button onClick={() => handleSend()} className="bg-violet-500 hover:bg-violet-600">
          <Send className="h-4 w-4" />
        </Button>

      </div>
    </div>
    </div>
  )
}
