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
    {question:"Hola", answer:"¡Hola, como estas? ¿En que puedo ayudarte?"},
]

export default function FAQBot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput]=useState('')

    const handleSend = () =>{
        if (input.trim() === '') return
        setMessages(prev => [...prev, { text: input, isUser:true}])

        const response = QA.find(qa => qa.question.toLowerCase() === input.toLowerCase())?.answer || 'Lo siento, no entiendo esa pregunta.'

        setTimeout(() =>{
        setMessages(prev => [...prev, {text: response, isUser: false}])
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
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu pregunta aquí..."
          className="flex-grow"
        />
        <Button onClick={handleSend} className="bg-violet-500 hover:bg-violet-600">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
      </div>
  )
}
