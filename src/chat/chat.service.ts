import { Injectable } from '@nestjs/common';
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

@Injectable()
export class ChatService {
  private llm;
  private chatHistory = [];

  constructor() {
    const apiKey = "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";
    this.llm = new ChatGroq({
      model: 'gemma2-9b-it',
      temperature: 0,
      apiKey
    });
  }

  async processMessage(input: string) {

    const farewellKeywords = ['bye', 'goodbye', 'see you', 'later', 'farewell', 'take care'];



    if (farewellKeywords.some(keyword => input.toLowerCase().includes(keyword))) {

      this.chatHistory = [];
      return {
        message: 'Goodbye! The chat history has been cleared. Feel free to start a new conversation anytime!',
      };
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful assistant in health.` +
        `Say greetings first. Then ask how you can help.` +
        `You can only ask one question at a time and give examples for them.` +
        `Ask and wait for them to answer.` +
        `After 3 questions, you conclude with a possible disease diagnosis, severity level, and temporary home precautions.` +
        `Ask them if they want to book an appointment on your website.`,
      ],
      new MessagesPlaceholder({ variableName: 'chat_history' }),
      ['human', '{input}'],
    ]);

    const formattedPrompt = await prompt.format({
      chat_history: this.chatHistory,
      input,
    });

    const response = await this.llm.invoke(formattedPrompt);

    let jsonResponse;
    try {
      // Kiểm tra xem phản hồi có phải JSON không
      jsonResponse = JSON.parse(response.content);
    } catch (error) {
      const sanitizedContent = response.content.replace(/^AI:\s*/, '');
      jsonResponse = {
        message: sanitizedContent.trim(),
      };
    }

    this.chatHistory.push(new HumanMessage({ content: input }));
    this.chatHistory.push(new AIMessage({ content: response.content }));

    return jsonResponse;
  }

}
