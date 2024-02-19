export class AppLogger {
    static log(level, service, message) {
        const reset = "\x1b[0m"; // Reset le style
        const date = new Date().toISOString();
        console.log(`${this.getColorByLevel(level)}[${date}] ${service} ${message}${reset}`);
    }

    static getColorByLevel(level) {
        switch (level) {
            case 'info':
                return "\x1b[32m"; // Green
            case 'warning':
                return "\x1b[33m"; // Yellow
            case 'error':
                return "\x1b[31m"; // Red
            default:
                return "\x1b[0m"; // Reset style
        }
    }
}