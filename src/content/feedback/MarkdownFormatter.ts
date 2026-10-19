import type { FeedbackItem, ExtensionSettings } from '../../shared/types';

export class MarkdownFormatter {
  format(url: string, feedback: FeedbackItem[], settings?: ExtensionSettings): string {
    const detail = settings?.outputDetail || 'standard';

    let markdown = `# 🎯 AXI-FEEDBACK DIRECTIVES (agentecho-axi)\n`;
    markdown += `- **URL:** ${url}\n`;
    markdown += `- **Timestamp:** ${new Date().toISOString().replace('T', ' ').substring(0, 19)}\n`;
    markdown += `- **Total Directives:** ${feedback.length}\n`;
    markdown += `\n---\n\n`;

    for (const item of feedback) {
      markdown += this.formatFeedback(item, detail);
      markdown += `\n---\n\n`;
    }

    return markdown;
  }

  private formatFeedback(item: FeedbackItem, detail: 'minimal' | 'standard' | 'comprehensive'): string {
    const action = item.action ? item.action.toUpperCase() : 'MODIFY';
    let markdown = `### ⚡ [AXI-TASK #${item.index}] ACTION: ${action}\n`;

    if (item.element.component) {
      markdown += `- **Component:** \`${item.element.component.name}\` (${item.element.component.framework})\n`;
      if (item.element.component.filePath) {
        markdown += `- **Source File:** \`${item.element.component.filePath}\`\n`;
      }
    }

    markdown += `- **Selector:** \`${item.element.selector}\`\n`;
    markdown += `- **Action:** \`${action}\`\n`;

    if (item.category) {
      markdown += `- **Category:** \`${item.category}\`\n`;
    }

    if (detail !== 'minimal') {
      if (item.element.textContent) {
        markdown += `- **Text Content:** "${item.element.textContent.trim().substring(0, 100)}"\n`;
      }
      if (item.element.classes.length > 0) {
        markdown += `- **Classes:** \`${item.element.classes.join('`, `')}\`\n`;
      }
      if (item.element.id) {
        markdown += `- **ID:** \`${item.element.id}\`\n`;
      }
    }

    markdown += `\n**Directive:**\n> ${item.comment}\n`;

    if (detail === 'comprehensive') {
      if (Object.keys(item.element.dataAttributes).length > 0) {
        markdown += `\n**Data Attributes:**\n`;
        for (const [key, value] of Object.entries(item.element.dataAttributes)) {
          markdown += `- \`${key}\`: "${value}"\n`;
        }
      }

      const rect = item.element.boundingRect;
      markdown += `\n- **Bounding Box:** x=${Math.round(rect.x)}, y=${Math.round(rect.y)}, w=${Math.round(rect.width)}, h=${Math.round(rect.height)}\n`;

      if (item.element.component?.props) {
        markdown += `- **Component Props:**\n`;
        for (const [key, value] of Object.entries(item.element.component.props)) {
          markdown += `  - \`${key}\`: ${JSON.stringify(value).substring(0, 50)}\n`;
        }
      }
    }

    return markdown;
  }
}
