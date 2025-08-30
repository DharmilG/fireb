'use server';
/**
 * @fileOverview A background report verification AI agent.
 *
 * - backgroundVerifyReport - A function that handles the report verification process in the background.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  VerifyReportInputSchema,
  VerifyReportOutputSchema,
  type VerifyReportOutput,
} from '@/ai/types/report-verification';
import {getReport, updateReport} from '@/services/report-service';

export async function backgroundVerifyReport(reportId: string): Promise<VerifyReportOutput> {
  return backgroundVerifyReportFlow(reportId);
}

const prompt = ai.definePrompt({
  name: 'backgroundVerifyReportPrompt',
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

const backgroundVerifyReportFlow = ai.defineFlow(
  {
    name: 'backgroundVerifyReportFlow',
    inputSchema: z.string(),
    outputSchema: VerifyReportOutputSchema,
  },
  async (reportId) => {
    const report = await getReport(reportId);
    if (!report) {
      throw new Error(`Report with id ${reportId} not found.`);
    }

    const {output} = await prompt({
      title: report.title,
      description: report.description,
      photoDataUri: report.imageUrl,
    });

    if (output) {
      await updateReport(reportId, {verification: output});
    }

    return output!;
  }
);
