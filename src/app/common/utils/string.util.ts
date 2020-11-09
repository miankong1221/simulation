export class StringUtils {

    public static getCurrentTime(): string {
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let hour = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        let minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        let second = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }

    public static getToday(): string {
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return year + '-' + month + '-' + day + ' 00' + ':' + '00' + ':' + '00'
    }

    public static isEmpty(val: string) {
        if (val === null || val === '' || val === undefined) {
            return true;
        }
        return false;
    }
} 