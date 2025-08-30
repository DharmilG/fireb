'use server';
/**
 * @fileOverview A report verification AI agent.
 *
 * - verifyReport - A function that handles the report verification process.
 * - VerifyReportInput - The input type for the verifyReport function.
 * - VerifyReportOutput - The return type for the verifyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const VerifyReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the incident, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().describe('The title of the report.'),
  description: z.string().describe('The description of the report.'),
});
export type VerifyReportInput = z.infer<typeof VerifyReportInputSchema>;

export const VerifyReportOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether or not the report is considered spam or fake.'),
  spamReason: z.string().describe('The reasoning for the spam determination.'),
  isAiGenerated: z.boolean().describe('Whether or not the image appears to be AI-generated.'),
  aiGeneratedReason: z.string().describe('The reasoning for the AI-generated image determination.'),
});
export type VerifyReportOutput = z.infer<typeof VerifyReportOutputSchema>;

export async function verifyReport(input: VerifyReportInput): Promise<VerifyReportOutput> {
  return verifyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyReportPrompt',
  input: {schema: VerifyReportInputSchema},
  output: {schema: VerifyReportOutputSchema},
  prompt: `You are an expert at identifying spam and fake user-submitted content. You also have expertise in detecting AI-generated images.

Analyze the provided report details and the image to determine if the report is likely spam/fake and if the image is AI-generated.

Report Title: {{{title}}}
Report Description: {{{description}}}
Report Photo: {{media url=photoDataUri}}

Consider the text content: is it coherent? Is it relevant to an environmental incident? Does it seem like an advertisement or malicious?
Consider the image: Does it look realistic? Are there any tell-tale signs of AI generation (e.g., strange artifacts, incorrect details, unusual lighting)?

Based on your analysis, provide a determination for isSpam and isAiGenerated, along with a brief reason for each.`,
});

const verifyReportFlow = ai.defineFlow(
  {
    name: 'verifyReportFlow',
    inputSchema: VerifyReportInputSchema,
    outputSchema: VerifyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
