/**
 * Enterprise Logger utility for structured console and test reporting.
 */

export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', `ℹ️  ${message}`));
  }

  static step(stepDescription: string): void {
    console.log(this.formatMessage('STEP', `🚀 ${stepDescription}`));
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('WARN', `⚠️  ${message}`));
  }

  static error(message: string, error?: unknown): void {
    console.error(this.formatMessage('ERROR', `❌ ${message}`), error ?? '');
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      console.debug(this.formatMessage('DEBUG', `🔍 ${message}`));
    }
  }
}
