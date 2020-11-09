
import { LabelService } from '../services/LabelService';
import { InjectionUtils } from '../utils/injection.utils';


export abstract class BaseComponent {
    public label: string;

    constructor() {
        const labelService = InjectionUtils.injector.get(LabelService);
        this.label = labelService.label;
    }
}
