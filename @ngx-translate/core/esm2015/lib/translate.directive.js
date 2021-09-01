/**
 * @fileoverview added by tsickle
 * Generated from: lib/translate.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Directive, ElementRef, Input } from '@angular/core';
import { isObservable } from 'rxjs';
import { TranslateService } from './translate.service';
import { equals, isDefined } from './util';
export class TranslateDirective {
    /**
     * @param {?} translateService
     * @param {?} element
     * @param {?} _ref
     */
    constructor(translateService, element, _ref) {
        this.translateService = translateService;
        this.element = element;
        this._ref = _ref;
        // subscribe to onTranslationChange event, in case the translations of the current lang change
        if (!this.onTranslationChangeSub) {
            this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                if (event.lang === this.translateService.currentLang) {
                    this.checkNodes(true, event.translations);
                }
            }));
        }
        // subscribe to onLangChange event, in case the language changes
        if (!this.onLangChangeSub) {
            this.onLangChangeSub = this.translateService.onLangChange.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this.checkNodes(true, event.translations);
            }));
        }
        // subscribe to onDefaultLangChange event, in case the default language changes
        if (!this.onDefaultLangChangeSub) {
            this.onDefaultLangChangeSub = this.translateService.onDefaultLangChange.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this.checkNodes(true);
            }));
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    set translate(key) {
        if (key) {
            this.key = key;
            this.checkNodes();
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    set translateParams(params) {
        if (!equals(this.currentParams, params)) {
            this.currentParams = params;
            this.checkNodes(true);
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        this.checkNodes();
    }
    /**
     * @param {?=} forceUpdate
     * @param {?=} translations
     * @return {?}
     */
    checkNodes(forceUpdate = false, translations) {
        /** @type {?} */
        let nodes = this.element.nativeElement.childNodes;
        // if the element is empty
        if (!nodes.length) {
            // we add the key as content
            this.setContent(this.element.nativeElement, this.key);
            nodes = this.element.nativeElement.childNodes;
        }
        for (let i = 0; i < nodes.length; ++i) {
            /** @type {?} */
            let node = nodes[i];
            if (node.nodeType === 3) { // node type 3 is a text node
                // node type 3 is a text node
                /** @type {?} */
                let key;
                if (forceUpdate) {
                    node.lastKey = null;
                }
                if (isDefined(node.lookupKey)) {
                    key = node.lookupKey;
                }
                else if (this.key) {
                    key = this.key;
                }
                else {
                    /** @type {?} */
                    let content = this.getContent(node);
                    /** @type {?} */
                    let trimmedContent = content.trim();
                    if (trimmedContent.length) {
                        node.lookupKey = trimmedContent;
                        // we want to use the content as a key, not the translation value
                        if (content !== node.currentValue) {
                            key = trimmedContent;
                            // the content was changed from the user, we'll use it as a reference if needed
                            node.originalContent = content || node.originalContent;
                        }
                        else if (node.originalContent) { // the content seems ok, but the lang has changed
                            // the current content is the translation, not the key, use the last real content as key
                            key = node.originalContent.trim();
                        }
                        else if (content !== node.currentValue) {
                            // we want to use the content as a key, not the translation value
                            key = trimmedContent;
                            // the content was changed from the user, we'll use it as a reference if needed
                            node.originalContent = content || node.originalContent;
                        }
                    }
                }
                this.updateValue(key, node, translations);
            }
        }
    }
    /**
     * @param {?} key
     * @param {?} node
     * @param {?} translations
     * @return {?}
     */
    updateValue(key, node, translations) {
        if (key) {
            if (node.lastKey === key && this.lastParams === this.currentParams) {
                return;
            }
            this.lastParams = this.currentParams;
            /** @type {?} */
            let onTranslation = (/**
             * @param {?} res
             * @return {?}
             */
            (res) => {
                node.lastKey = key;
                if (!node.originalContent) {
                    node.originalContent = this.getContent(node);
                }
                node.currentValue = isDefined(res) ? res : (node.originalContent || key);
                // we replace in the original content to preserve spaces that we might have trimmed
                this.setContent(node, this.key ? node.currentValue : node.originalContent.replace(key, node.currentValue));
                this._ref.markForCheck();
            });
            if (isDefined(translations)) {
                /** @type {?} */
                let res = this.translateService.getParsedResult(translations, key, this.currentParams);
                if (isObservable(res)) {
                    res.subscribe(onTranslation);
                }
                else {
                    onTranslation(res);
                }
            }
            else {
                this.translateService.get(key, this.currentParams).subscribe(onTranslation);
            }
        }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    getContent(node) {
        return isDefined(node.textContent) ? node.textContent : node.data;
    }
    /**
     * @param {?} node
     * @param {?} content
     * @return {?}
     */
    setContent(node, content) {
        if (isDefined(node.textContent)) {
            node.textContent = content;
        }
        else {
            node.data = content;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.onLangChangeSub) {
            this.onLangChangeSub.unsubscribe();
        }
        if (this.onDefaultLangChangeSub) {
            this.onDefaultLangChangeSub.unsubscribe();
        }
        if (this.onTranslationChangeSub) {
            this.onTranslationChangeSub.unsubscribe();
        }
    }
}
TranslateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[translate],[ngx-translate]'
            },] }
];
/** @nocollapse */
TranslateDirective.ctorParameters = () => [
    { type: TranslateService },
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
TranslateDirective.propDecorators = {
    translate: [{ type: Input }],
    translateParams: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TranslateDirective.prototype.key;
    /** @type {?} */
    TranslateDirective.prototype.lastParams;
    /** @type {?} */
    TranslateDirective.prototype.currentParams;
    /** @type {?} */
    TranslateDirective.prototype.onLangChangeSub;
    /** @type {?} */
    TranslateDirective.prototype.onDefaultLangChangeSub;
    /** @type {?} */
    TranslateDirective.prototype.onTranslationChangeSub;
    /**
     * @type {?}
     * @private
     */
    TranslateDirective.prototype.translateService;
    /**
     * @type {?}
     * @private
     */
    TranslateDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    TranslateDirective.prototype._ref;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUvY29yZS9zcmMvbGliL3RyYW5zbGF0ZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQW1CLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBZSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUEwQyxnQkFBZ0IsRUFBeUIsTUFBTSxxQkFBcUIsQ0FBQztBQUN0SCxPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUt6QyxNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7SUFzQjdCLFlBQW9CLGdCQUFrQyxFQUFVLE9BQW1CLEVBQVUsSUFBdUI7UUFBaEcscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUNsSCw4RkFBOEY7UUFDOUYsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLFNBQVM7Ozs7WUFBQyxDQUFDLEtBQTZCLEVBQUUsRUFBRTtnQkFDbEgsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDM0M7WUFDSCxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsZ0VBQWdFO1FBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pC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QUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztTQUNyQjtJQUNILENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEM7UUFFRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0M7UUFFRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0M7SUFDSCxDQUFDOzs7WUEzSkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7YUFDeEM7Ozs7WUFMZ0QsZ0JBQWdCO1lBRlQsVUFBVTtZQUF4QyxpQkFBaUI7Ozt3QkFnQnhDLEtBQUs7OEJBT0wsS0FBSzs7OztJQWROLGlDQUFZOztJQUNaLHdDQUFnQjs7SUFDaEIsMkNBQW1COztJQUNuQiw2Q0FBOEI7O0lBQzlCLG9EQUFxQzs7SUFDckMsb0RBQXFDOzs7OztJQWdCekIsOENBQTBDOzs7OztJQUFFLHFDQUEyQjs7Ozs7SUFBRSxrQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyVmlld0NoZWNrZWQsIENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1N1YnNjcmlwdGlvbiwgaXNPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtEZWZhdWx0TGFuZ0NoYW5nZUV2ZW50LCBMYW5nQ2hhbmdlRXZlbnQsIFRyYW5zbGF0ZVNlcnZpY2UsIFRyYW5zbGF0aW9uQ2hhbmdlRXZlbnR9IGZyb20gJy4vdHJhbnNsYXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQge2VxdWFscywgaXNEZWZpbmVkfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbdHJhbnNsYXRlXSxbbmd4LXRyYW5zbGF0ZV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xyXG4gIGtleTogc3RyaW5nO1xyXG4gIGxhc3RQYXJhbXM6IGFueTtcclxuICBjdXJyZW50UGFyYW1zOiBhbnk7XHJcbiAgb25MYW5nQ2hhbmdlU3ViOiBTdWJzY3JpcHRpb247XHJcbiAgb25EZWZhdWx0TGFuZ0NoYW5nZVN1YjogU3Vic2NyaXB0aW9uO1xyXG4gIG9uVHJhbnNsYXRpb25DaGFuZ2VTdWI6IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgQElucHV0KCkgc2V0IHRyYW5zbGF0ZShrZXk6IHN0cmluZykge1xyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICB0aGlzLmtleSA9IGtleTtcclxuICAgICAgdGhpcy5jaGVja05vZGVzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKSBzZXQgdHJhbnNsYXRlUGFyYW1zKHBhcmFtczogYW55KSB7XHJcbiAgICBpZiAoIWVxdWFscyh0aGlzLmN1cnJlbnRQYXJhbXMsIHBhcmFtcykpIHtcclxuICAgICAgdGhpcy5jdXJyZW50UGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICB0aGlzLmNoZWNrTm9kZXModHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0ZVNlcnZpY2U6IFRyYW5zbGF0ZVNlcnZpY2UsIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgLy8gc3Vic2NyaWJlIHRvIG9uVHJhbnNsYXRpb25DaGFuZ2UgZXZlbnQsIGluIGNhc2UgdGhlIHRyYW5zbGF0aW9ucyBvZiB0aGUgY3VycmVudCBsYW5nIGNoYW5nZVxyXG4gICAgaWYgKCF0aGlzLm9uVHJhbnNsYXRpb25DaGFuZ2VTdWIpIHtcclxuICAgICAgdGhpcy5vblRyYW5zbGF0aW9uQ2hhbmdlU3ViID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLm9uVHJhbnNsYXRpb25DaGFuZ2Uuc3Vic2NyaWJlKChldmVudDogVHJhbnNsYXRpb25DaGFuZ2VFdmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5sYW5nID09PSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuY3VycmVudExhbmcpIHtcclxuICAgICAgICAgIHRoaXMuY2hlY2tOb2Rlcyh0cnVlLCBldmVudC50cmFuc2xhdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3Vic2NyaWJlIHRvIG9uTGFuZ0NoYW5nZSBldmVudCwgaW4gY2FzZSB0aGUgbGFuZ3VhZ2UgY2hhbmdlc1xyXG4gICAgaWYgKCF0aGlzLm9uTGFuZ0NoYW5nZVN1Yikge1xyXG4gICAgICB0aGlzLm9uTGFuZ0NoYW5nZVN1YiA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5vbkxhbmdDaGFuZ2Uuc3Vic2NyaWJlKChldmVudDogTGFuZ0NoYW5nZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5jaGVja05vZGVzKHRydWUsIGV2ZW50LnRyYW5zbGF0aW9ucyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHN1YnNjcmliZSB0byBvbkRlZmF1bHRMYW5nQ2hhbmdlIGV2ZW50LCBpbiBjYXNlIHRoZSBkZWZhdWx0IGxhbmd1YWdlIGNoYW5nZXNcclxuICAgIGlmICghdGhpcy5vbkRlZmF1bHRMYW5nQ2hhbmdlU3ViKSB7XHJcbiAgICAgIHRoaXMub25EZWZhdWx0TGFuZ0NoYW5nZVN1YiA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5vbkRlZmF1bHRMYW5nQ2hhbmdlLnN1YnNjcmliZSgoZXZlbnQ6IERlZmF1bHRMYW5nQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLmNoZWNrTm9kZXModHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xyXG4gICAgdGhpcy5jaGVja05vZGVzKCk7XHJcbiAgfVxyXG5cclxuICBjaGVja05vZGVzKGZvcmNlVXBkYXRlID0gZmFsc2UsIHRyYW5zbGF0aW9ucz86IGFueSkge1xyXG4gICAgbGV0IG5vZGVzOiBOb2RlTGlzdCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBlbXB0eVxyXG4gICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcclxuICAgICAgLy8gd2UgYWRkIHRoZSBrZXkgYXMgY29udGVudFxyXG4gICAgICB0aGlzLnNldENvbnRlbnQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHRoaXMua2V5KTtcclxuICAgICAgbm9kZXMgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICBsZXQgbm9kZTogYW55ID0gbm9kZXNbaV07XHJcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7IC8vIG5vZGUgdHlwZSAzIGlzIGEgdGV4dCBub2RlXHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xyXG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSkge1xyXG4gICAgICAgICAgbm9kZS5sYXN0S2V5ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNEZWZpbmVkKG5vZGUubG9va3VwS2V5KSkge1xyXG4gICAgICAgICAga2V5ID0gbm9kZS5sb29rdXBLZXk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmtleSkge1xyXG4gICAgICAgICAga2V5ID0gdGhpcy5rZXk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KG5vZGUpO1xyXG4gICAgICAgICAgbGV0IHRyaW1tZWRDb250ZW50ID0gY29udGVudC50cmltKCk7XHJcbiAgICAgICAgICBpZiAodHJpbW1lZENvbnRlbnQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG5vZGUubG9va3VwS2V5ID0gdHJpbW1lZENvbnRlbnQ7XHJcbiAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gdXNlIHRoZSBjb250ZW50IGFzIGEga2V5LCBub3QgdGhlIHRyYW5zbGF0aW9uIHZhbHVlXHJcbiAgICAgICAgICAgIGlmIChjb250ZW50ICE9PSBub2RlLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgIGtleSA9IHRyaW1tZWRDb250ZW50O1xyXG4gICAgICAgICAgICAgIC8vIHRoZSBjb250ZW50IHdhcyBjaGFuZ2VkIGZyb20gdGhlIHVzZXIsIHdlJ2xsIHVzZSBpdCBhcyBhIHJlZmVyZW5jZSBpZiBuZWVkZWRcclxuICAgICAgICAgICAgICBub2RlLm9yaWdpbmFsQ29udGVudCA9IGNvbnRlbnQgfHwgbm9kZS5vcmlnaW5hbENvbnRlbnQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5vcmlnaW5hbENvbnRlbnQpIHsgLy8gdGhlIGNvbnRlbnQgc2VlbXMgb2ssIGJ1dCB0aGUgbGFuZyBoYXMgY2hhbmdlZFxyXG4gICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IGNvbnRlbnQgaXMgdGhlIHRyYW5zbGF0aW9uLCBub3QgdGhlIGtleSwgdXNlIHRoZSBsYXN0IHJlYWwgY29udGVudCBhcyBrZXlcclxuICAgICAgICAgICAgICBrZXkgPSBub2RlLm9yaWdpbmFsQ29udGVudC50cmltKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGVudCAhPT0gbm9kZS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgICAvLyB3ZSB3YW50IHRvIHVzZSB0aGUgY29udGVudCBhcyBhIGtleSwgbm90IHRoZSB0cmFuc2xhdGlvbiB2YWx1ZVxyXG4gICAgICAgICAgICAgIGtleSA9IHRyaW1tZWRDb250ZW50O1xyXG4gICAgICAgICAgICAgIC8vIHRoZSBjb250ZW50IHdhcyBjaGFuZ2VkIGZyb20gdGhlIHVzZXIsIHdlJ2xsIHVzZSBpdCBhcyBhIHJlZmVyZW5jZSBpZiBuZWVkZWRcclxuICAgICAgICAgICAgICBub2RlLm9yaWdpbmFsQ29udGVudCA9IGNvbnRlbnQgfHwgbm9kZS5vcmlnaW5hbENvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShrZXksIG5vZGUsIHRyYW5zbGF0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVZhbHVlKGtleTogc3RyaW5nLCBub2RlOiBhbnksIHRyYW5zbGF0aW9uczogYW55KSB7XHJcbiAgICBpZiAoa2V5KSB7XHJcbiAgICAgIGlmIChub2RlLmxhc3RLZXkgPT09IGtleSAmJiB0aGlzLmxhc3RQYXJhbXMgPT09IHRoaXMuY3VycmVudFBhcmFtcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sYXN0UGFyYW1zID0gdGhpcy5jdXJyZW50UGFyYW1zO1xyXG5cclxuICAgICAgbGV0IG9uVHJhbnNsYXRpb24gPSAocmVzOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIG5vZGUubGFzdEtleSA9IGtleTtcclxuICAgICAgICBpZiAoIW5vZGUub3JpZ2luYWxDb250ZW50KSB7XHJcbiAgICAgICAgICBub2RlLm9yaWdpbmFsQ29udGVudCA9IHRoaXMuZ2V0Q29udGVudChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5jdXJyZW50VmFsdWUgPSBpc0RlZmluZWQocmVzKSA/IHJlcyA6IChub2RlLm9yaWdpbmFsQ29udGVudCB8fCBrZXkpO1xyXG4gICAgICAgIC8vIHdlIHJlcGxhY2UgaW4gdGhlIG9yaWdpbmFsIGNvbnRlbnQgdG8gcHJlc2VydmUgc3BhY2VzIHRoYXQgd2UgbWlnaHQgaGF2ZSB0cmltbWVkXHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KG5vZGUsIHRoaXMua2V5ID8gbm9kZS5jdXJyZW50VmFsdWUgOiBub2RlLm9yaWdpbmFsQ29udGVudC5yZXBsYWNlKGtleSwgbm9kZS5jdXJyZW50VmFsdWUpKTtcclxuICAgICAgICB0aGlzLl9yZWYubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoaXNEZWZpbmVkKHRyYW5zbGF0aW9ucykpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldFBhcnNlZFJlc3VsdCh0cmFuc2xhdGlvbnMsIGtleSwgdGhpcy5jdXJyZW50UGFyYW1zKTtcclxuICAgICAgICBpZiAoaXNPYnNlcnZhYmxlKHJlcykpIHtcclxuICAgICAgICAgIHJlcy5zdWJzY3JpYmUob25UcmFuc2xhdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG9uVHJhbnNsYXRpb24ocmVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChrZXksIHRoaXMuY3VycmVudFBhcmFtcykuc3Vic2NyaWJlKG9uVHJhbnNsYXRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDb250ZW50KG5vZGU6IGFueSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaXNEZWZpbmVkKG5vZGUudGV4dENvbnRlbnQpID8gbm9kZS50ZXh0Q29udGVudCA6IG5vZGUuZGF0YTtcclxuICB9XHJcblxyXG4gIHNldENvbnRlbnQobm9kZTogYW55LCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmIChpc0RlZmluZWQobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgbm9kZS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlLmRhdGEgPSBjb250ZW50O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5vbkxhbmdDaGFuZ2VTdWIpIHtcclxuICAgICAgdGhpcy5vbkxhbmdDaGFuZ2VTdWIudW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vbkRlZmF1bHRMYW5nQ2hhbmdlU3ViKSB7XHJcbiAgICAgIHRoaXMub25EZWZhdWx0TGFuZ0NoYW5nZVN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9uVHJhbnNsYXRpb25DaGFuZ2VTdWIpIHtcclxuICAgICAgdGhpcy5vblRyYW5zbGF0aW9uQ2hhbmdlU3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==