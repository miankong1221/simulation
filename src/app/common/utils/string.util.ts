export class StringUtils {

    public static getCurrentTime(): string {
        const date = new Date();
        const year = date.getFullYear() + '';
        const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        const day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        const hour = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        const minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        const second = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
    }

    public static getCurTime(): string {
        const date = new Date();
        const year = date.getFullYear() + '';
        const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        const day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        const hour = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        const minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        const second = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return hour + ':' + minute + ':' + second;
    }

    public static getToday(date: Date): string {
        // const date = new Date();
        const year = date.getFullYear() + '';
        const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        const day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return year + '-' + month + '-' + day + 'T' + '00' + ':' + '00' + ':' + '00' + 'Z';
    }

    public static getInterval(date: Date): any {
      const minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
      const second = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
      return second;
  }

    public static isEmpty(val: string): boolean {
        if (val === null || val === '' || val === undefined) {
            return true;
        }
        return false;
    }
}
