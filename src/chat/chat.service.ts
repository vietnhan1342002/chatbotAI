import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
@Injectable()
export class ChatService {
  private readonly chatGroq: ChatGroq;

  constructor() {
    this.chatGroq = new ChatGroq({
      apiKey: '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',
    });
  }

  async askGPT(prompt: string): Promise<string> {
    try {
      const response = await this.chatGroq.completionWithRetry({
        model: 'gemma2-9b-it', // Hoặc 'gpt-4'
        messages: [
          {
            role: 'system',
            content:
              ' As an assistant, your task is to diagnose possible diseases based on the user’s symptoms. Follow this step-by-step conversation process:\nStart with the initial symptom provided by the user.Ask one follow-up question related to the initial symptom.Based on the user’s response, ask the second follow-up question to gather more symptoms.Continue asking a third question to collect comprehensive symptom details.Conclude with a possible disease diagnosis, its severity level, and temporary home precautions.Format your responses and questions in JSON format.\nHere’s an interaction example:\nUser: I have a headache.\nAssistant:\n{​​\n“question”: “Do you have any associated symptoms, such as dizziness or sensitivity to light?”\n}​​\nUser: Yes, I also feel nauseous and have sensitivity to light.\nAssistant:\n{​​\n“question”: “Have you recently experienced stress, lack of sleep, or dehydration?”\n}​​\nUser: No, I haven’t experienced any of those.\nAssistant:\n{​​\n“question”: “Does the headache feel like pressure, pounding, or stabbing pain?”\n}​​\nUser: It feels like a pounding pain.\nAssistant:\n{​​\n“diagnosis”: “Based on your symptoms, you may have a migraine.”,\n“severity”: “Moderate”,\n“precautions”: “Rest in a dark, quiet room, stay hydrated, and take an over-the-counter pain reliever if needed.”\n}\n\nprecautions more​​\nStart by asking the user their initial symptom.',
          },
          {
            role: 'user',
            content: 'I have a rash',
          },
          {
            role: 'assistant',
            content:
              '{\n"question": "Can you describe the rash? For example, is it itchy, red, bumpy, or does it have any other characteristics?"\n} \n',
          },
          {
            role: 'user',
            content: 'itchy',
          },
          {
            role: 'assistant',
            content:
              '{\n"question": "Where is the rash located on your body? Is it on a specific area or all over?"\n} \n',
          },
          {
            role: 'user',
            content: 'My hand',
          },
          {
            role: 'assistant',
            content:
              '{\n"question": "Have you come into contact with any new soaps, lotions, plants, or animals recently?"\n} \n',
          },
          {
            role: 'user',
            content: 'lotions',
          },
          {
            role: 'assistant',
            content:
              '{\n"diagnosis": "Based on your symptoms, you may have a contact dermatitis.",\n"severity": "Mild",\n"precautions": "Stop using the new lotion immediately. Apply a cool compress to the affected area and consider using an over-the-counter hydrocortisone cream. If the rash worsens or spreads, consult a doctor."\n} \n',
          },
          { role: 'user', content: prompt },
        ],
      });
      return response.choices[0].message?.content || 'No response';
    } catch (error) {
      throw new Error(`Error from GroqAI: ${error.message}`);
    }
  }
}

//GROQ-API-KEY: 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
