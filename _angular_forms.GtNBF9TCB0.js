import { a as c, b as h } from "@nf-internal/chunk-4CLCTAJ7";
import * as o from "@angular/core";
import { InjectionToken as w, forwardRef as l, \u0275isPromise as dt, \u0275RuntimeError as ne, Version as ct, untracked as m, computed as O, signal as x, EventEmitter as _, booleanAttribute as re, ChangeDetectorRef as Fe, inject as P, ApplicationRef as ht, DestroyRef as ft, afterNextRender as gt } from "@angular/core";
import { from as pt, forkJoin as mt, Subject as _t } from "rxjs";
import { map as vt } from "rxjs/operators";
import { \u0275getDOM as me } from "@angular/common";
var Ee = (() => { class t {
    _renderer;
    _elementRef;
    onChange = e => { };
    onTouched = () => { };
    constructor(e, i) { this._renderer = e, this._elementRef = i; }
    setProperty(e, i) { this._renderer.setProperty(this._elementRef.nativeElement, e, i); }
    registerOnTouched(e) { this.onTouched = e; }
    registerOnChange(e) { this.onChange = e; }
    setDisabledState(e) { this.setProperty("disabled", e); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(o.Renderer2), o.\u0275\u0275directiveInject(o.ElementRef)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t });
} return t; })(), V = (() => { class t extends Ee {
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, features: [o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), g = new w(""), yt = { provide: g, useExisting: l(() => Ct), multi: !0 }, Ct = (() => { class t extends V {
    writeValue(e) { this.setProperty("checked", e); }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "checkbox", "formControlName", ""], ["input", "type", "checkbox", "formControl", ""], ["input", "type", "checkbox", "ngModel", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("change", function (a) { return r.onChange(a.target.checked); })("blur", function () { return r.onTouched(); }); }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([yt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Vt = { provide: g, useExisting: l(() => we), multi: !0 };
function Dt() { let t = me() ? me().getUserAgent() : ""; return /android (\d+)/.test(t.toLowerCase()); }
var bt = new w(""), we = (() => { class t extends Ee {
    _compositionMode;
    _composing = !1;
    constructor(e, i, r) { super(e, i), this._compositionMode = r, this._compositionMode == null && (this._compositionMode = !Dt()); }
    writeValue(e) { let i = e ?? ""; this.setProperty("value", i); }
    _handleInput(e) { (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(e); }
    _compositionStart() { this._composing = !0; }
    _compositionEnd(e) { this._composing = !1, this._compositionMode && this.onChange(e); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(o.Renderer2), o.\u0275\u0275directiveInject(o.ElementRef), o.\u0275\u0275directiveInject(bt, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("input", function (a) { return r._handleInput(a.target.value); })("blur", function () { return r.onTouched(); })("compositionstart", function () { return r._compositionStart(); })("compositionend", function (a) { return r._compositionEnd(a.target.value); }); }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Vt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
function oe(t) { return t == null || se(t) === 0; }
function se(t) { return t == null ? null : Array.isArray(t) || typeof t == "string" ? t.length : t instanceof Set ? t.size : null; }
var d = new w(""), C = new w(""), At = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, _e = class {
    static min(n) { return Ie(n); }
    static max(n) { return Se(n); }
    static required(n) { return Ne(n); }
    static requiredTrue(n) { return Oe(n); }
    static email(n) { return xe(n); }
    static minLength(n) { return Pe(n); }
    static maxLength(n) { return Re(n); }
    static pattern(n) { return ke(n); }
    static nullValidator(n) { return L(); }
    static compose(n) { return He(n); }
    static composeAsync(n) { return Le(n); }
};
function Ie(t) { return n => { if (n.value == null || t == null)
    return null; let e = parseFloat(n.value); return !isNaN(e) && e < t ? { min: { min: t, actual: n.value } } : null; }; }
function Se(t) { return n => { if (n.value == null || t == null)
    return null; let e = parseFloat(n.value); return !isNaN(e) && e > t ? { max: { max: t, actual: n.value } } : null; }; }
function Ne(t) { return oe(t.value) ? { required: !0 } : null; }
function Oe(t) { return t.value === !0 ? null : { required: !0 }; }
function xe(t) { return oe(t.value) || At.test(t.value) ? null : { email: !0 }; }
function Pe(t) { return n => { let e = n.value?.length ?? se(n.value); return e === null || e === 0 ? null : e < t ? { minlength: { requiredLength: t, actualLength: e } } : null; }; }
function Re(t) { return n => { let e = n.value?.length ?? se(n.value); return e !== null && e > t ? { maxlength: { requiredLength: t, actualLength: e } } : null; }; }
function ke(t) { if (!t)
    return L; let n, e; return typeof t == "string" ? (e = "", t.charAt(0) !== "^" && (e += "^"), e += t, t.charAt(t.length - 1) !== "$" && (e += "$"), n = new RegExp(e)) : (e = t.toString(), n = t), i => { if (oe(i.value))
    return null; let r = i.value; return n.test(r) ? null : { pattern: { requiredPattern: e, actualValue: r } }; }; }
function L(t) { return null; }
function je(t) { return t != null; }
function Ge(t) { return dt(t) ? pt(t) : t; }
function Te(t) { let n = {}; return t.forEach(e => { n = e != null ? c(c({}, n), e) : n; }), Object.keys(n).length === 0 ? null : n; }
function Be(t, n) { return n.map(e => e(t)); }
function Mt(t) { return !t.validate; }
function Ue(t) { return t.map(n => Mt(n) ? n : e => n.validate(e)); }
function He(t) { if (!t)
    return null; let n = t.filter(je); return n.length == 0 ? null : function (e) { return Te(Be(e, n)); }; }
function ae(t) { return t != null ? He(Ue(t)) : null; }
function Le(t) { if (!t)
    return null; let n = t.filter(je); return n.length == 0 ? null : function (e) { let i = Be(e, n).map(Ge); return mt(i).pipe(vt(Te)); }; }
function le(t) { return t != null ? Le(Ue(t)) : null; }
function ve(t, n) { return t === null ? [n] : Array.isArray(t) ? [...t, n] : [t, n]; }
function $e(t) { return t._rawValidators; }
function We(t) { return t._rawAsyncValidators; }
function ie(t) { return t ? Array.isArray(t) ? t : [t] : []; }
function $(t, n) { return Array.isArray(t) ? t.includes(n) : t === n; }
function ye(t, n) { let e = ie(n); return ie(t).forEach(r => { $(e, r) || e.push(r); }), e; }
function Ce(t, n) { return ie(n).filter(e => !$(t, e)); }
var W = class {
    get value() { return this.control ? this.control.value : null; }
    get valid() { return this.control ? this.control.valid : null; }
    get invalid() { return this.control ? this.control.invalid : null; }
    get pending() { return this.control ? this.control.pending : null; }
    get disabled() { return this.control ? this.control.disabled : null; }
    get enabled() { return this.control ? this.control.enabled : null; }
    get errors() { return this.control ? this.control.errors : null; }
    get pristine() { return this.control ? this.control.pristine : null; }
    get dirty() { return this.control ? this.control.dirty : null; }
    get touched() { return this.control ? this.control.touched : null; }
    get status() { return this.control ? this.control.status : null; }
    get untouched() { return this.control ? this.control.untouched : null; }
    get statusChanges() { return this.control ? this.control.statusChanges : null; }
    get valueChanges() { return this.control ? this.control.valueChanges : null; }
    get path() { return null; }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(n) { this._rawValidators = n || [], this._composedValidatorFn = ae(this._rawValidators); }
    _setAsyncValidators(n) { this._rawAsyncValidators = n || [], this._composedAsyncValidatorFn = le(this._rawAsyncValidators); }
    get validator() { return this._composedValidatorFn || null; }
    get asyncValidator() { return this._composedAsyncValidatorFn || null; }
    _onDestroyCallbacks = [];
    _registerOnDestroy(n) { this._onDestroyCallbacks.push(n); }
    _invokeOnDestroyCallbacks() { this._onDestroyCallbacks.forEach(n => n()), this._onDestroyCallbacks = []; }
    reset(n = void 0) { this.control?.reset(n); }
    hasError(n, e) { return this.control ? this.control.hasError(n, e) : !1; }
    getError(n, e) { return this.control ? this.control.getError(n, e) : null; }
}, u = class extends W {
    name;
    get formDirective() { return null; }
    get path() { return null; }
}, f = class extends W {
    _parent = null;
    name = null;
    valueAccessor = null;
}, q = class {
    _cd;
    constructor(n) { this._cd = n; }
    get isTouched() { return this._cd?.control?._touched?.(), !!this._cd?.control?.touched; }
    get isUntouched() { return !!this._cd?.control?.untouched; }
    get isPristine() { return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine; }
    get isDirty() { return !!this._cd?.control?.dirty; }
    get isValid() { return this._cd?.control?._status?.(), !!this._cd?.control?.valid; }
    get isInvalid() { return !!this._cd?.control?.invalid; }
    get isPending() { return !!this._cd?.control?.pending; }
    get isSubmitted() { return this._cd?._submitted?.(), !!this._cd?.submitted; }
};
var Tn = (() => { class t extends q {
    constructor(e) { super(e); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(f, 2)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], hostVars: 14, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275classProp("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)("ng-pristine", r.isPristine)("ng-dirty", r.isDirty)("ng-valid", r.isValid)("ng-invalid", r.isInvalid)("ng-pending", r.isPending); }, standalone: !1, features: [o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Bn = (() => { class t extends q {
    constructor(e) { super(e); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 10)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["", "formArray", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], hostVars: 16, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275classProp("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)("ng-pristine", r.isPristine)("ng-dirty", r.isDirty)("ng-valid", r.isValid)("ng-invalid", r.isInvalid)("ng-pending", r.isPending)("ng-submitted", r.isSubmitted); }, standalone: !1, features: [o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
var Un = new ct("21.2.17");
var I = "VALID", H = "INVALID", A = "PENDING", S = "DISABLED", v = class {
}, z = class extends v {
    value;
    source;
    constructor(n, e) { super(), this.value = n, this.source = e; }
}, R = class extends v {
    pristine;
    source;
    constructor(n, e) { super(), this.pristine = n, this.source = e; }
}, k = class extends v {
    touched;
    source;
    constructor(n, e) { super(), this.touched = n, this.source = e; }
}, M = class extends v {
    status;
    source;
    constructor(n, e) { super(), this.status = n, this.source = e; }
}, Z = class extends v {
    source;
    constructor(n) { super(), this.source = n; }
}, j = class extends v {
    source;
    constructor(n) { super(), this.source = n; }
};
function ue(t) { return (Q(t) ? t.validators : t) || null; }
function Ft(t) { return Array.isArray(t) ? ae(t) : t || null; }
function de(t, n) { return (Q(n) ? n.asyncValidators : t) || null; }
function Et(t) { return Array.isArray(t) ? le(t) : t || null; }
function Q(t) { return t != null && !Array.isArray(t) && typeof t == "object"; }
function qe(t, n, e) { let i = t.controls; if (!(n ? Object.keys(i) : i).length)
    throw new ne(1e3, ""); if (!i[e])
    throw new ne(1001, ""); }
function ze(t, n, e) { t._forEachChild((i, r) => { if (e[r] === void 0)
    throw new ne(-1002, ""); }); }
var E = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => { };
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(n, e) { this._assignValidators(n), this._assignAsyncValidators(e); }
    get validator() { return this._composedValidatorFn; }
    set validator(n) { this._rawValidators = this._composedValidatorFn = n; }
    get asyncValidator() { return this._composedAsyncValidatorFn; }
    set asyncValidator(n) { this._rawAsyncValidators = this._composedAsyncValidatorFn = n; }
    get parent() { return this._parent; }
    get status() { return m(this.statusReactive); }
    set status(n) { m(() => this.statusReactive.set(n)); }
    _status = O(() => this.statusReactive());
    statusReactive = x(void 0);
    get valid() { return this.status === I; }
    get invalid() { return this.status === H; }
    get pending() { return this.status === A; }
    get disabled() { return this.status === S; }
    get enabled() { return this.status !== S; }
    errors;
    get pristine() { return m(this.pristineReactive); }
    set pristine(n) { m(() => this.pristineReactive.set(n)); }
    _pristine = O(() => this.pristineReactive());
    pristineReactive = x(!0);
    get dirty() { return !this.pristine; }
    get touched() { return m(this.touchedReactive); }
    set touched(n) { m(() => this.touchedReactive.set(n)); }
    _touched = O(() => this.touchedReactive());
    touchedReactive = x(!1);
    get untouched() { return !this.touched; }
    _events = new _t;
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() { return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"; }
    setValidators(n) { this._assignValidators(n); }
    setAsyncValidators(n) { this._assignAsyncValidators(n); }
    addValidators(n) { this.setValidators(ye(n, this._rawValidators)); }
    addAsyncValidators(n) { this.setAsyncValidators(ye(n, this._rawAsyncValidators)); }
    removeValidators(n) { this.setValidators(Ce(n, this._rawValidators)); }
    removeAsyncValidators(n) { this.setAsyncValidators(Ce(n, this._rawAsyncValidators)); }
    hasValidator(n) { return $(this._rawValidators, n); }
    hasAsyncValidator(n) { return $(this._rawAsyncValidators, n); }
    clearValidators() { this.validator = null; }
    clearAsyncValidators() { this.asyncValidator = null; }
    markAsTouched(n = {}) { let e = this.touched === !1; this.touched = !0; let i = n.sourceControl ?? this; n.onlySelf || this._parent?.markAsTouched(h(c({}, n), { sourceControl: i })), e && n.emitEvent !== !1 && this._events.next(new k(!0, i)); }
    markAllAsDirty(n = {}) { this.markAsDirty({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: this }), this._forEachChild(e => e.markAllAsDirty(n)); }
    markAllAsTouched(n = {}) { this.markAsTouched({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: this }), this._forEachChild(e => e.markAllAsTouched(n)); }
    markAsUntouched(n = {}) { let e = this.touched === !0; this.touched = !1, this._pendingTouched = !1; let i = n.sourceControl ?? this; this._forEachChild(r => { r.markAsUntouched({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: i }); }), n.onlySelf || this._parent?._updateTouched(n, i), e && n.emitEvent !== !1 && this._events.next(new k(!1, i)); }
    markAsDirty(n = {}) { let e = this.pristine === !0; this.pristine = !1; let i = n.sourceControl ?? this; n.onlySelf || this._parent?.markAsDirty(h(c({}, n), { sourceControl: i })), e && n.emitEvent !== !1 && this._events.next(new R(!1, i)); }
    markAsPristine(n = {}) { let e = this.pristine === !1; this.pristine = !0, this._pendingDirty = !1; let i = n.sourceControl ?? this; this._forEachChild(r => { r.markAsPristine({ onlySelf: !0, emitEvent: n.emitEvent }); }), n.onlySelf || this._parent?._updatePristine(n, i), e && n.emitEvent !== !1 && this._events.next(new R(!0, i)); }
    markAsPending(n = {}) { this.status = A; let e = n.sourceControl ?? this; n.emitEvent !== !1 && (this._events.next(new M(this.status, e)), this.statusChanges.emit(this.status)), n.onlySelf || this._parent?.markAsPending(h(c({}, n), { sourceControl: e })); }
    disable(n = {}) { let e = this._parentMarkedDirty(n.onlySelf); this.status = S, this.errors = null, this._forEachChild(r => { r.disable(h(c({}, n), { onlySelf: !0 })); }), this._updateValue(); let i = n.sourceControl ?? this; n.emitEvent !== !1 && (this._events.next(new z(this.value, i)), this._events.next(new M(this.status, i)), this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._updateAncestors(h(c({}, n), { skipPristineCheck: e }), this), this._onDisabledChange.forEach(r => r(!0)); }
    enable(n = {}) { let e = this._parentMarkedDirty(n.onlySelf); this.status = I, this._forEachChild(i => { i.enable(h(c({}, n), { onlySelf: !0 })); }), this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }), this._updateAncestors(h(c({}, n), { skipPristineCheck: e }), this), this._onDisabledChange.forEach(i => i(!1)); }
    _updateAncestors(n, e) { n.onlySelf || (this._parent?.updateValueAndValidity(n), n.skipPristineCheck || this._parent?._updatePristine({}, e), this._parent?._updateTouched({}, e)); }
    setParent(n) { this._parent = n; }
    getRawValue() { return this.value; }
    updateValueAndValidity(n = {}) { if (this._setInitialStatus(), this._updateValue(), this.enabled) {
        let i = this._cancelExistingSubscription();
        this.errors = this._runValidator(), this.status = this._calculateStatus(), (this.status === I || this.status === A) && this._runAsyncValidator(i, n.emitEvent);
    } let e = n.sourceControl ?? this; n.emitEvent !== !1 && (this._events.next(new z(this.value, e)), this._events.next(new M(this.status, e)), this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), n.onlySelf || this._parent?.updateValueAndValidity(h(c({}, n), { sourceControl: e })); }
    _updateTreeValidity(n = { emitEvent: !0 }) { this._forEachChild(e => e._updateTreeValidity(n)), this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }); }
    _setInitialStatus() { this.status = this._allControlsDisabled() ? S : I; }
    _runValidator() { return this.validator ? this.validator(this) : null; }
    _runAsyncValidator(n, e) { if (this.asyncValidator) {
        this.status = A, this._hasOwnPendingAsyncValidator = { emitEvent: e !== !1, shouldHaveEmitted: n !== !1 };
        let i = Ge(this.asyncValidator(this));
        this._asyncValidationSubscription = i.subscribe(r => { this._hasOwnPendingAsyncValidator = null, this.setErrors(r, { emitEvent: e, shouldHaveEmitted: n }); });
    } }
    _cancelExistingSubscription() { if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let n = (this._hasOwnPendingAsyncValidator?.emitEvent || this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ?? !1;
        return this._hasOwnPendingAsyncValidator = null, n;
    } return !1; }
    setErrors(n, e = {}) { this.errors = n, this._updateControlsErrors(e.emitEvent !== !1, this, e.shouldHaveEmitted); }
    get(n) { let e = n; return e == null || (Array.isArray(e) || (e = e.split(".")), e.length === 0) ? null : e.reduce((i, r) => i && i._find(r), this); }
    getError(n, e) { let i = e ? this.get(e) : this; return i?.errors ? i.errors[n] : null; }
    hasError(n, e) { return !!this.getError(n, e); }
    get root() { let n = this; for (; n._parent;)
        n = n._parent; return n; }
    _updateControlsErrors(n, e, i) { this.status = this._calculateStatus(), n && this.statusChanges.emit(this.status), (n || i) && this._events.next(new M(this.status, e)), this._parent && this._parent._updateControlsErrors(n, e, i); }
    _initObservables() { this.valueChanges = new _, this.statusChanges = new _; }
    _calculateStatus() { return this._allControlsDisabled() ? S : this.errors ? H : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(A) ? A : this._anyControlsHaveStatus(H) ? H : I; }
    _anyControlsHaveStatus(n) { return this._anyControls(e => e.status === n); }
    _anyControlsDirty() { return this._anyControls(n => n.dirty); }
    _anyControlsTouched() { return this._anyControls(n => n.touched); }
    _updatePristine(n, e) { let i = !this._anyControlsDirty(), r = this.pristine !== i; this.pristine = i, n.onlySelf || this._parent?._updatePristine(n, e), r && this._events.next(new R(this.pristine, e)); }
    _updateTouched(n = {}, e) { this.touched = this._anyControlsTouched(), this._events.next(new k(this.touched, e)), n.onlySelf || this._parent?._updateTouched(n, e); }
    _onDisabledChange = [];
    _registerOnCollectionChange(n) { this._onCollectionChange = n; }
    _setUpdateStrategy(n) { Q(n) && n.updateOn != null && (this._updateOn = n.updateOn); }
    _parentMarkedDirty(n) { return !n && !!this._parent?.dirty && !this._parent._anyControlsDirty(); }
    _find(n) { return null; }
    _assignValidators(n) { this._rawValidators = Array.isArray(n) ? n.slice() : n, this._composedValidatorFn = Ft(this._rawValidators); }
    _assignAsyncValidators(n) { this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n, this._composedAsyncValidatorFn = Et(this._rawAsyncValidators); }
}, y = class extends E {
    constructor(n, e, i) { super(ue(e), de(i, e)), this.controls = n, this._initObservables(), this._setUpdateStrategy(e), this._setUpControls(), this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }); }
    controls;
    registerControl(n, e) { return this.controls[n] ? this.controls[n] : (this.controls[n] = e, e.setParent(this), e._registerOnCollectionChange(this._onCollectionChange), e); }
    addControl(n, e, i = {}) { this.registerControl(n, e), this.updateValueAndValidity({ emitEvent: i.emitEvent }), this._onCollectionChange(); }
    removeControl(n, e = {}) { this.controls[n] && this.controls[n]._registerOnCollectionChange(() => { }), delete this.controls[n], this.updateValueAndValidity({ emitEvent: e.emitEvent }), this._onCollectionChange(); }
    setControl(n, e, i = {}) { this.controls[n] && this.controls[n]._registerOnCollectionChange(() => { }), delete this.controls[n], e && this.registerControl(n, e), this.updateValueAndValidity({ emitEvent: i.emitEvent }), this._onCollectionChange(); }
    contains(n) { return this.controls.hasOwnProperty(n) && this.controls[n].enabled; }
    setValue(n, e = {}) { ze(this, !0, n), Object.keys(n).forEach(i => { qe(this, !0, i), this.controls[i].setValue(n[i], { onlySelf: !0, emitEvent: e.emitEvent }); }), this.updateValueAndValidity(e); }
    patchValue(n, e = {}) { n != null && (Object.keys(n).forEach(i => { let r = this.controls[i]; r && r.patchValue(n[i], { onlySelf: !0, emitEvent: e.emitEvent }); }), this.updateValueAndValidity(e)); }
    reset(n = {}, e = {}) { this._forEachChild((i, r) => { i.reset(n ? n[r] : null, h(c({}, e), { onlySelf: !0 })); }), this._updatePristine(e, this), this._updateTouched(e, this), this.updateValueAndValidity(e), e?.emitEvent !== !1 && this._events.next(new j(this)); }
    getRawValue() { return this._reduceChildren({}, (n, e, i) => (n[i] = e.getRawValue(), n)); }
    _syncPendingControls() { let n = this._reduceChildren(!1, (e, i) => i._syncPendingControls() ? !0 : e); return n && this.updateValueAndValidity({ onlySelf: !0 }), n; }
    _forEachChild(n) { Object.keys(this.controls).forEach(e => { let i = this.controls[e]; i && n(i, e); }); }
    _setUpControls() { this._forEachChild(n => { n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange); }); }
    _updateValue() { this.value = this._reduceValue(); }
    _anyControls(n) { for (let [e, i] of Object.entries(this.controls))
        if (this.contains(e) && n(i))
            return !0; return !1; }
    _reduceValue() { let n = {}; return this._reduceChildren(n, (e, i, r) => ((i.enabled || this.disabled) && (e[r] = i.value), e)); }
    _reduceChildren(n, e) { let i = n; return this._forEachChild((r, s) => { i = e(i, r, s); }), i; }
    _allControlsDisabled() { for (let n of Object.keys(this.controls))
        if (this.controls[n].enabled)
            return !1; return Object.keys(this.controls).length > 0 || this.disabled; }
    _find(n) { return this.controls.hasOwnProperty(n) ? this.controls[n] : null; }
};
var Hn = y, Ln = t => t instanceof y, X = class extends y {
}, $n = t => t instanceof X, D = new w("", { factory: () => B }), B = "always";
function ee(t, n) { return [...n.path, t]; }
function G(t, n, e = B) { ce(t, n), n.valueAccessor.writeValue(t.value), (t.disabled || e === "always") && n.valueAccessor.setDisabledState?.(t.disabled), It(t, n), Nt(t, n), St(t, n), wt(t, n); }
function Y(t, n, e = !0) { let i = () => { }; n?.valueAccessor?.registerOnChange(i), n?.valueAccessor?.registerOnTouched(i), J(t, n), t && (n._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => { })); }
function K(t, n) { t.forEach(e => { e.registerOnValidatorChange && e.registerOnValidatorChange(n); }); }
function wt(t, n) { if (n.valueAccessor.setDisabledState) {
    let e = i => { n.valueAccessor.setDisabledState(i); };
    t.registerOnDisabledChange(e), n._registerOnDestroy(() => { t._unregisterOnDisabledChange(e); });
} }
function ce(t, n) { let e = $e(t); n.validator !== null ? t.setValidators(ve(e, n.validator)) : typeof e == "function" && t.setValidators([e]); let i = We(t); n.asyncValidator !== null ? t.setAsyncValidators(ve(i, n.asyncValidator)) : typeof i == "function" && t.setAsyncValidators([i]); let r = () => t.updateValueAndValidity(); K(n._rawValidators, r), K(n._rawAsyncValidators, r); }
function J(t, n) { let e = !1; if (t !== null) {
    if (n.validator !== null) {
        let r = $e(t);
        if (Array.isArray(r) && r.length > 0) {
            let s = r.filter(a => a !== n.validator);
            s.length !== r.length && (e = !0, t.setValidators(s));
        }
    }
    if (n.asyncValidator !== null) {
        let r = We(t);
        if (Array.isArray(r) && r.length > 0) {
            let s = r.filter(a => a !== n.asyncValidator);
            s.length !== r.length && (e = !0, t.setAsyncValidators(s));
        }
    }
} let i = () => { }; return K(n._rawValidators, i), K(n._rawAsyncValidators, i), e; }
function It(t, n) { n.valueAccessor.registerOnChange(e => { t._pendingValue = e, t._pendingChange = !0, t._pendingDirty = !0, t.updateOn === "change" && Ze(t, n); }); }
function St(t, n) { n.valueAccessor.registerOnTouched(() => { t._pendingTouched = !0, t.updateOn === "blur" && t._pendingChange && Ze(t, n), t.updateOn !== "submit" && t.markAsTouched(); }); }
function Ze(t, n) { t._pendingDirty && t.markAsDirty(), t.setValue(t._pendingValue, { emitModelToViewChange: !1 }), n.viewToModelUpdate(t._pendingValue), t._pendingChange = !1; }
function Nt(t, n) { let e = (i, r) => { n.valueAccessor.writeValue(i), r && n.viewToModelUpdate(i); }; t.registerOnChange(e), n._registerOnDestroy(() => { t._unregisterOnChange(e); }); }
function Xe(t, n) { t == null, ce(t, n); }
function Ot(t, n) { return J(t, n); }
function he(t, n) { if (!t.hasOwnProperty("model"))
    return !1; let e = t.model; return e.isFirstChange() ? !0 : !Object.is(n, e.currentValue); }
function xt(t) { return Object.getPrototypeOf(t.constructor) === V; }
function Ye(t, n) { t._syncPendingControls(), n.forEach(e => { let i = e.control; i.updateOn === "submit" && i._pendingChange && (e.viewToModelUpdate(i._pendingValue), i._pendingChange = !1); }); }
function fe(t, n) { if (!n)
    return null; Array.isArray(n); let e, i, r; return n.forEach(s => { s.constructor === we ? e = s : xt(s) ? i = s : r = s; }), r || i || e || null; }
function Pt(t, n) { let e = t.indexOf(n); e > -1 && t.splice(e, 1); }
var Rt = { provide: u, useExisting: l(() => Ke) }, N = Promise.resolve(), Ke = (() => { class t extends u {
    callSetDisabledState;
    get submitted() { return m(this.submittedReactive); }
    _submitted = O(() => this.submittedReactive());
    submittedReactive = x(!1);
    _directives = new Set;
    form;
    ngSubmit = new _;
    options;
    constructor(e, i, r) { super(), this.callSetDisabledState = r, this.form = new y({}, ae(e), le(i)); }
    ngAfterViewInit() { this._setUpdateStrategy(); }
    get formDirective() { return this; }
    get control() { return this.form; }
    get path() { return []; }
    get controls() { return this.form.controls; }
    addControl(e) { N.then(() => { let i = this._findContainer(e.path); e.control = i.registerControl(e.name, e.control), G(e.control, e, this.callSetDisabledState), e.control.updateValueAndValidity({ emitEvent: !1 }), this._directives.add(e); }); }
    getControl(e) { return this.form.get(e.path); }
    removeControl(e) { N.then(() => { this._findContainer(e.path)?.removeControl(e.name), this._directives.delete(e); }); }
    addFormGroup(e) { N.then(() => { let i = this._findContainer(e.path), r = new y({}); Xe(r, e), i.registerControl(e.name, r), r.updateValueAndValidity({ emitEvent: !1 }); }); }
    removeFormGroup(e) { N.then(() => { this._findContainer(e.path)?.removeControl?.(e.name); }); }
    getFormGroup(e) { return this.form.get(e.path); }
    updateModel(e, i) { N.then(() => { this.form.get(e.path).setValue(i); }); }
    setValue(e) { this.control.setValue(e); }
    onSubmit(e) { return this.submittedReactive.set(!0), Ye(this.form, this._directives), this.ngSubmit.emit(e), this.form._events.next(new Z(this.control)), e?.target?.method === "dialog"; }
    onReset() { this.resetForm(); }
    resetForm(e = void 0) { this.form.reset(e), this.submittedReactive.set(!1); }
    _setUpdateStrategy() { this.options && this.options.updateOn != null && (this.form._updateOn = this.options.updateOn); }
    _findContainer(e) { return e.pop(), e.length ? this.form.get(e) : this.form; }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10), o.\u0275\u0275directiveInject(D, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", "", 3, "formArray", ""], ["ng-form"], ["", "ngForm", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("submit", function (a) { return r.onSubmit(a); })("reset", function () { return r.onReset(); }); }, inputs: { options: [0, "ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Rt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
function Ve(t, n) { let e = t.indexOf(n); e > -1 && t.splice(e, 1); }
function De(t) { return typeof t == "object" && t !== null && Object.keys(t).length === 2 && "value" in t && "disabled" in t; }
var F = class extends E {
    defaultValue = null;
    _onChange = [];
    _pendingValue;
    _pendingChange = !1;
    constructor(n = null, e, i) { super(ue(e), de(i, e)), this._applyFormState(n), this._setUpdateStrategy(e), this._initObservables(), this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }), Q(e) && (e.nonNullable || e.initialValueIsDefault) && (De(n) ? this.defaultValue = n.value : this.defaultValue = n); }
    setValue(n, e = {}) { this.value = this._pendingValue = n, this._onChange.length && e.emitModelToViewChange !== !1 && this._onChange.forEach(i => i(this.value, e.emitViewToModelChange !== !1)), this.updateValueAndValidity(e); }
    patchValue(n, e = {}) { this.setValue(n, e); }
    reset(n = this.defaultValue, e = {}) { this._applyFormState(n), this.markAsPristine(e), this.markAsUntouched(e), this.setValue(this.value, e), e.overwriteDefaultValue && (this.defaultValue = this.value), this._pendingChange = !1, e?.emitEvent !== !1 && this._events.next(new j(this)); }
    _updateValue() { }
    _anyControls(n) { return !1; }
    _allControlsDisabled() { return this.disabled; }
    registerOnChange(n) { this._onChange.push(n); }
    _unregisterOnChange(n) { Ve(this._onChange, n); }
    registerOnDisabledChange(n) { this._onDisabledChange.push(n); }
    _unregisterOnDisabledChange(n) { Ve(this._onDisabledChange, n); }
    _forEachChild(n) { }
    _syncPendingControls() { return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), this._pendingChange) ? (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), !0) : !1; }
    _applyFormState(n) { De(n) ? (this.value = this._pendingValue = n.value, n.disabled ? this.disable({ onlySelf: !0, emitEvent: !1 }) : this.enable({ onlySelf: !0, emitEvent: !1 })) : this.value = this._pendingValue = n; }
}, qn = F, kt = t => t instanceof F, Je = (() => { class t extends u {
    _parent;
    ngOnInit() { this._checkParentType(), this.formDirective.addFormGroup(this); }
    ngOnDestroy() { this.formDirective?.removeFormGroup(this); }
    get control() { return this.formDirective.getFormGroup(this); }
    get path() { return ee(this.name == null ? this.name : this.name.toString(), this._parent); }
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    _checkParentType() { }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, standalone: !1, features: [o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
var jt = { provide: u, useExisting: l(() => Gt) }, Gt = (() => { class t extends Je {
    name = "";
    constructor(e, i, r) { super(), this._parent = e, this._setValidators(i), this._setAsyncValidators(r); }
    _checkParentType() { !(this._parent instanceof t) && this._parent instanceof Ke; }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 5), o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "ngModelGroup", ""]], inputs: { name: [0, "ngModelGroup", "name"] }, exportAs: ["ngModelGroup"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([jt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Tt = { provide: f, useExisting: l(() => Bt) }, be = Promise.resolve(), Bt = (() => { class t extends f {
    _changeDetectorRef;
    callSetDisabledState;
    control = new F;
    static ngAcceptInputType_isDisabled;
    _registered = !1;
    viewModel;
    name = "";
    isDisabled;
    model;
    options;
    update = new _;
    constructor(e, i, r, s, a, p) { super(), this._changeDetectorRef = a, this.callSetDisabledState = p, this._parent = e, this._setValidators(i), this._setAsyncValidators(r), this.valueAccessor = fe(this, s); }
    ngOnChanges(e) { if (this._checkForErrors(), !this._registered || "name" in e) {
        if (this._registered && (this._checkName(), this.formDirective)) {
            let i = e.name.previousValue;
            this.formDirective.removeControl({ name: i, path: this._getPath(i) });
        }
        this._setUpControl();
    } "isDisabled" in e && this._updateDisabled(e), he(e, this.viewModel) && (this._updateValue(this.model), this.viewModel = this.model); }
    ngOnDestroy() { this.formDirective?.removeControl(this); }
    get path() { return this._getPath(this.name); }
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    viewToModelUpdate(e) { this.viewModel = e, this.update.emit(e); }
    _setUpControl() { this._setUpdateStrategy(), this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this), this._registered = !0; }
    _setUpdateStrategy() { this.options && this.options.updateOn != null && (this.control._updateOn = this.options.updateOn); }
    _isStandalone() { return !this._parent || !!(this.options && this.options.standalone); }
    _setUpStandalone() { G(this.control, this, this.callSetDisabledState), this.control.updateValueAndValidity({ emitEvent: !1 }); }
    _checkForErrors() { this._checkName(); }
    _checkName() { this.options && this.options.name && (this.name = this.options.name), !this._isStandalone() && this.name; }
    _updateValue(e) { be.then(() => { this.control.setValue(e, { emitViewToModelChange: !1 }), this._changeDetectorRef?.markForCheck(); }); }
    _updateDisabled(e) { let i = e.isDisabled.currentValue, r = i !== 0 && re(i); be.then(() => { r && !this.control.disabled ? this.control.disable() : !r && this.control.disabled && this.control.enable(), this._changeDetectorRef?.markForCheck(); }); }
    _getPath(e) { return this._parent ? ee(e, this._parent) : [e]; }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 9), o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10), o.\u0275\u0275directiveInject(g, 10), o.\u0275\u0275directiveInject(Fe, 8), o.\u0275\u0275directiveInject(D, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]], inputs: { name: "name", isDisabled: [0, "disabled", "isDisabled"], model: [0, "ngModel", "model"], options: [0, "ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, exportAs: ["ngModel"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Tt]), o.\u0275\u0275InheritDefinitionFeature, o.\u0275\u0275NgOnChangesFeature] });
} return t; })();
var zn = (() => { class t {
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]], hostAttrs: ["novalidate", ""], standalone: !1 });
} return t; })(), Ut = { provide: g, useExisting: l(() => Ht), multi: !0 }, Ht = (() => { class t extends V {
    writeValue(e) { let i = e ?? ""; this.setProperty("value", i); }
    registerOnChange(e) { this.onChange = i => { e(i == "" ? null : parseFloat(i)); }; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("input", function (a) { return r.onChange(a.target.value); })("blur", function () { return r.onTouched(); }); }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Ut]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Lt = { provide: g, useExisting: l(() => Wt), multi: !0 };
var $t = (() => { class t {
    _accessors = [];
    add(e, i) { this._accessors.push([e, i]); }
    remove(e) { for (let i = this._accessors.length - 1; i >= 0; --i)
        if (this._accessors[i][1] === e) {
            this._accessors.splice(i, 1);
            return;
        } }
    select(e) { this._accessors.forEach(i => { this._isSameGroup(i, e) && i[1] !== e && i[1].fireUncheck(e.value); }); }
    _isSameGroup(e, i) { return e[0].control ? e[0]._parent === i._control._parent && e[1].name === i.name : !1; }
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })(), Wt = (() => { class t extends V {
    _registry;
    _injector;
    _state;
    _control;
    _fn;
    setDisabledStateFired = !1;
    onChange = () => { };
    name;
    formControlName;
    value;
    callSetDisabledState = P(D, { optional: !0 }) ?? B;
    constructor(e, i, r, s) { super(e, i), this._registry = r, this._injector = s; }
    ngOnInit() { this._control = this._injector.get(f), this._checkName(), this._registry.add(this._control, this); }
    ngOnDestroy() { this._registry.remove(this); }
    writeValue(e) { this._state = e === this.value, this.setProperty("checked", this._state); }
    registerOnChange(e) { this._fn = e, this.onChange = () => { e(this.value), this._registry.select(this); }; }
    setDisabledState(e) { (this.setDisabledStateFired || e || this.callSetDisabledState === "whenDisabledForLegacyCode") && this.setProperty("disabled", e), this.setDisabledStateFired = !0; }
    fireUncheck(e) { this.writeValue(e); }
    _checkName() { this.name && this.formControlName && (this.name, this.formControlName), !this.name && this.formControlName && (this.name = this.formControlName); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(o.Renderer2), o.\u0275\u0275directiveInject(o.ElementRef), o.\u0275\u0275directiveInject($t), o.\u0275\u0275directiveInject(o.Injector)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("change", function () { return r.onChange(); })("blur", function () { return r.onTouched(); }); }, inputs: { name: "name", formControlName: "formControlName", value: "value" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Lt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), qt = { provide: g, useExisting: l(() => zt), multi: !0 }, zt = (() => { class t extends V {
    writeValue(e) { this.setProperty("value", parseFloat(e)); }
    registerOnChange(e) { this.onChange = i => { e(i == "" ? null : parseFloat(i)); }; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "range", "formControlName", ""], ["input", "type", "range", "formControl", ""], ["input", "type", "range", "ngModel", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("change", function (a) { return r.onChange(a.target.value); })("input", function (a) { return r.onChange(a.target.value); })("blur", function () { return r.onTouched(); }); }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([qt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), T = class extends E {
    constructor(n, e, i) { super(ue(e), de(i, e)), this.controls = n, this._initObservables(), this._setUpdateStrategy(e), this._setUpControls(), this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }); }
    controls;
    at(n) { return this.controls[this._adjustIndex(n)]; }
    push(n, e = {}) { Array.isArray(n) ? n.forEach(i => { this.controls.push(i), this._registerControl(i); }) : (this.controls.push(n), this._registerControl(n)), this.updateValueAndValidity({ emitEvent: e.emitEvent }), this._onCollectionChange(); }
    insert(n, e, i = {}) { this.controls.splice(n, 0, e), this._registerControl(e), this.updateValueAndValidity({ emitEvent: i.emitEvent }); }
    removeAt(n, e = {}) { let i = this._adjustIndex(n); i < 0 && (i = 0), this.controls[i] && this.controls[i]._registerOnCollectionChange(() => { }), this.controls.splice(i, 1), this.updateValueAndValidity({ emitEvent: e.emitEvent }); }
    setControl(n, e, i = {}) { let r = this._adjustIndex(n); r < 0 && (r = 0), this.controls[r] && this.controls[r]._registerOnCollectionChange(() => { }), this.controls.splice(r, 1), e && (this.controls.splice(r, 0, e), this._registerControl(e)), this.updateValueAndValidity({ emitEvent: i.emitEvent }), this._onCollectionChange(); }
    get length() { return this.controls.length; }
    setValue(n, e = {}) { ze(this, !1, n), n.forEach((i, r) => { qe(this, !1, r), this.at(r).setValue(i, { onlySelf: !0, emitEvent: e.emitEvent }); }), this.updateValueAndValidity(e); }
    patchValue(n, e = {}) { n != null && (n.forEach((i, r) => { this.at(r) && this.at(r).patchValue(i, { onlySelf: !0, emitEvent: e.emitEvent }); }), this.updateValueAndValidity(e)); }
    reset(n = [], e = {}) { this._forEachChild((i, r) => { i.reset(n[r], h(c({}, e), { onlySelf: !0 })); }), this._updatePristine(e, this), this._updateTouched(e, this), this.updateValueAndValidity(e), e?.emitEvent !== !1 && this._events.next(new j(this)); }
    getRawValue() { return this.controls.map(n => n.getRawValue()); }
    clear(n = {}) { this.controls.length < 1 || (this._forEachChild(e => e._registerOnCollectionChange(() => { })), this.controls.splice(0), this.updateValueAndValidity({ emitEvent: n.emitEvent })); }
    _adjustIndex(n) { return n < 0 ? n + this.length : n; }
    _syncPendingControls() { let n = this.controls.reduce((e, i) => i._syncPendingControls() ? !0 : e, !1); return n && this.updateValueAndValidity({ onlySelf: !0 }), n; }
    _forEachChild(n) { this.controls.forEach((e, i) => { n(e, i); }); }
    _updateValue() { this.value = this.controls.filter(n => n.enabled || this.disabled).map(n => n.value); }
    _anyControls(n) { return this.controls.some(e => e.enabled && n(e)); }
    _setUpControls() { this._forEachChild(n => this._registerControl(n)); }
    _allControlsDisabled() { for (let n of this.controls)
        if (n.enabled)
            return !1; return this.controls.length > 0 || this.disabled; }
    _registerControl(n) { n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange); }
    _find(n) { return this.at(n) ?? null; }
}, Zn = T, Xn = t => t instanceof T, ge = (() => { class t extends u {
    callSetDisabledState;
    get submitted() { return m(this._submittedReactive); }
    set submitted(e) { this._submittedReactive.set(e); }
    _submitted = O(() => this._submittedReactive());
    _submittedReactive = x(!1);
    _oldForm;
    _onCollectionChange = () => this._updateDomValue();
    directives = [];
    constructor(e, i, r) { super(), this.callSetDisabledState = r, this._setValidators(e), this._setAsyncValidators(i); }
    ngOnChanges(e) { this.onChanges(e); }
    ngOnDestroy() { this.onDestroy(); }
    onChanges(e) { this._checkFormPresent(), e.hasOwnProperty("form") && (this._updateValidators(), this._updateDomValue(), this._updateRegistrations(), this._oldForm = this.form); }
    onDestroy() { this.form && (J(this.form, this), this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => { })); }
    get formDirective() { return this; }
    get path() { return []; }
    addControl(e) { let i = this.form.get(e.path); return G(i, e, this.callSetDisabledState), i.updateValueAndValidity({ emitEvent: !1 }), this.directives.push(e), i; }
    getControl(e) { return this.form.get(e.path); }
    removeControl(e) { Y(e.control || null, e, !1), Pt(this.directives, e); }
    addFormGroup(e) { this._setUpFormContainer(e); }
    removeFormGroup(e) { this._cleanUpFormContainer(e); }
    getFormGroup(e) { return this.form.get(e.path); }
    getFormArray(e) { return this.form.get(e.path); }
    addFormArray(e) { this._setUpFormContainer(e); }
    removeFormArray(e) { this._cleanUpFormContainer(e); }
    updateModel(e, i) { this.form.get(e.path).setValue(i); }
    onReset() { this.resetForm(); }
    resetForm(e = void 0, i = {}) { this.form.reset(e, i), this._submittedReactive.set(!1); }
    onSubmit(e) { return this.submitted = !0, Ye(this.form, this.directives), this.ngSubmit.emit(e), this.form._events.next(new Z(this.control)), e?.target?.method === "dialog"; }
    _updateDomValue() { this.directives.forEach(e => { let i = e.control, r = this.form.get(e.path); i !== r && (Y(i || null, e), kt(r) && (G(r, e, this.callSetDisabledState), e.control = r)); }), this.form._updateTreeValidity({ emitEvent: !1 }); }
    _setUpFormContainer(e) { let i = this.form.get(e.path); Xe(i, e), i.updateValueAndValidity({ emitEvent: !1 }); }
    _cleanUpFormContainer(e) { let i = this.form?.get(e.path); i && Ot(i, e) && i.updateValueAndValidity({ emitEvent: !1 }); }
    _updateRegistrations() { this.form._registerOnCollectionChange(this._onCollectionChange), this._oldForm?._registerOnCollectionChange(() => { }); }
    _updateValidators() { ce(this.form, this), this._oldForm && J(this._oldForm, this); }
    _checkFormPresent() { this.form; }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10), o.\u0275\u0275directiveInject(D, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, features: [o.\u0275\u0275InheritDefinitionFeature, o.\u0275\u0275NgOnChangesFeature] });
} return t; })(), Zt = { provide: u, useExisting: l(() => Xt) }, Xt = (() => { class t extends ge {
    form = null;
    ngSubmit = new _;
    get control() { return this.form; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formArray", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("submit", function (a) { return r.onSubmit(a); })("reset", function () { return r.onReset(); }); }, inputs: { form: [0, "formArray", "form"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Zt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), pe = new w(""), Yt = { provide: f, useExisting: l(() => Kt) }, Kt = (() => { class t extends f {
    _ngModelWarningConfig;
    callSetDisabledState;
    viewModel;
    form;
    set isDisabled(e) { }
    model;
    update = new _;
    static _ngModelWarningSentOnce = !1;
    _ngModelWarningSent = !1;
    constructor(e, i, r, s, a) { super(), this._ngModelWarningConfig = s, this.callSetDisabledState = a, this._setValidators(e), this._setAsyncValidators(i), this.valueAccessor = fe(this, r); }
    ngOnChanges(e) { if (this._isControlChanged(e)) {
        let i = e.form.previousValue;
        i && Y(i, this, !1), G(this.form, this, this.callSetDisabledState), this.form.updateValueAndValidity({ emitEvent: !1 });
    } he(e, this.viewModel) && (this.form.setValue(this.model), this.viewModel = this.model); }
    ngOnDestroy() { this.form && Y(this.form, this, !1); }
    get path() { return []; }
    get control() { return this.form; }
    viewToModelUpdate(e) { this.viewModel = e, this.update.emit(e); }
    _isControlChanged(e) { return e.hasOwnProperty("form"); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10), o.\u0275\u0275directiveInject(g, 10), o.\u0275\u0275directiveInject(pe, 8), o.\u0275\u0275directiveInject(D, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formControl", ""]], inputs: { form: [0, "formControl", "form"], isDisabled: [0, "disabled", "isDisabled"], model: [0, "ngModel", "model"] }, outputs: { update: "ngModelChange" }, exportAs: ["ngForm"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Yt]), o.\u0275\u0275InheritDefinitionFeature, o.\u0275\u0275NgOnChangesFeature] });
} return t; })(), Jt = { provide: u, useExisting: l(() => Qe) }, Qe = (() => { class t extends Je {
    name = null;
    constructor(e, i, r) { super(), this._parent = e, this._setValidators(i), this._setAsyncValidators(r); }
    _checkParentType() { tt(this._parent); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 13), o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formGroupName", ""]], inputs: { name: [0, "formGroupName", "name"] }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Jt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Qt = { provide: u, useExisting: l(() => et) }, et = (() => { class t extends u {
    _parent;
    name = null;
    constructor(e, i, r) { super(), this._parent = e, this._setValidators(i), this._setAsyncValidators(r); }
    ngOnInit() { tt(this._parent), this.formDirective.addFormArray(this); }
    ngOnDestroy() { this.formDirective?.removeFormArray(this); }
    get control() { return this.formDirective.getFormArray(this); }
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    get path() { return ee(this.name == null ? this.name : this.name.toString(), this._parent); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 13), o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formArrayName", ""]], inputs: { name: [0, "formArrayName", "name"] }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Qt]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
function tt(t) { return !(t instanceof Qe) && !(t instanceof ge) && !(t instanceof et); }
var en = { provide: f, useExisting: l(() => tn) }, tn = (() => { class t extends f {
    _ngModelWarningConfig;
    _added = !1;
    viewModel;
    control;
    name = null;
    set isDisabled(e) { }
    model;
    update = new _;
    static _ngModelWarningSentOnce = !1;
    _ngModelWarningSent = !1;
    constructor(e, i, r, s, a) { super(), this._ngModelWarningConfig = a, this._parent = e, this._setValidators(i), this._setAsyncValidators(r), this.valueAccessor = fe(this, s); }
    ngOnChanges(e) { this._added || this._setUpControl(), he(e, this.viewModel) && (this.viewModel = this.model, this.formDirective.updateModel(this, this.model)); }
    ngOnDestroy() { this.formDirective?.removeControl(this); }
    viewToModelUpdate(e) { this.viewModel = e, this.update.emit(e); }
    get path() { return ee(this.name == null ? this.name : this.name.toString(), this._parent); }
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    _setUpControl() { this.control = this.formDirective.addControl(this), this._added = !0; }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(u, 13), o.\u0275\u0275directiveInject(d, 10), o.\u0275\u0275directiveInject(C, 10), o.\u0275\u0275directiveInject(g, 10), o.\u0275\u0275directiveInject(pe, 8)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formControlName", ""]], inputs: { name: [0, "formControlName", "name"], isDisabled: [0, "disabled", "isDisabled"], model: [0, "ngModel", "model"] }, outputs: { update: "ngModelChange" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([en]), o.\u0275\u0275InheritDefinitionFeature, o.\u0275\u0275NgOnChangesFeature] });
} return t; })();
var nn = { provide: u, useExisting: l(() => rn) }, rn = (() => { class t extends ge {
    form = null;
    ngSubmit = new _;
    get control() { return this.form; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "formGroup", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("submit", function (a) { return r.onSubmit(a); })("reset", function () { return r.onReset(); }); }, inputs: { form: [0, "formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], standalone: !1, features: [o.\u0275\u0275ProvidersFeature([nn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), on = { provide: g, useExisting: l(() => it), multi: !0 };
function nt(t, n) { return t == null ? `${n}` : (n && typeof n == "object" && (n = "Object"), `${t}: ${n}`.slice(0, 50)); }
function sn(t) { return t.split(":")[0]; }
var it = (() => { class t extends V {
    value;
    _optionMap = new Map;
    _idCounter = 0;
    set compareWith(e) { this._compareWith = e; }
    _compareWith = Object.is;
    appRefInjector = P(ht).injector;
    destroyRef = P(ft);
    cdr = P(Fe);
    _queuedWrite = !1;
    _writeValueAfterRender() { this._queuedWrite || this.appRefInjector.destroyed || (this._queuedWrite = !0, gt({ write: () => { this.destroyRef.destroyed || (this._queuedWrite = !1, this.writeValue(this.value)); } }, { injector: this.appRefInjector })); }
    writeValue(e) { this.cdr.markForCheck(), this.value = e; let i = this._getOptionId(e), r = nt(i, e); this.setProperty("value", r); }
    registerOnChange(e) { this.onChange = i => { this.value = this._getOptionValue(i), e(this.value); }; }
    _registerOption() { return (this._idCounter++).toString(); }
    _getOptionId(e) { for (let i of this._optionMap.keys())
        if (this._compareWith(this._optionMap.get(i), e))
            return i; return null; }
    _getOptionValue(e) { let i = sn(e); return this._optionMap.has(i) ? this._optionMap.get(i) : e; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("change", function (a) { return r.onChange(a.target.value); })("blur", function () { return r.onTouched(); }); }, inputs: { compareWith: "compareWith" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([on]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Yn = (() => { class t {
    _element;
    _renderer;
    _select;
    id;
    constructor(e, i, r) { this._element = e, this._renderer = i, this._select = r, this._select && (this.id = this._select._registerOption()); }
    set ngValue(e) { this._select != null && (this._select._optionMap.set(this.id, e), this._setElementValue(nt(this.id, e)), this._select._writeValueAfterRender()); }
    set value(e) { this._setElementValue(e), this._select?._writeValueAfterRender(); }
    _setElementValue(e) { this._renderer.setProperty(this._element.nativeElement, "value", e); }
    ngOnDestroy() { this._select?._optionMap.delete(this.id), this._select?._writeValueAfterRender(); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(o.ElementRef), o.\u0275\u0275directiveInject(o.Renderer2), o.\u0275\u0275directiveInject(it, 9)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["option"]], inputs: { ngValue: "ngValue", value: "value" }, standalone: !1 });
} return t; })(), an = { provide: g, useExisting: l(() => rt), multi: !0 };
function Ae(t, n) { return t == null ? `${n}` : (typeof n == "string" && (n = `'${n}'`), n && typeof n == "object" && (n = "Object"), `${t}: ${n}`.slice(0, 50)); }
function ln(t) { return t.split(":")[0]; }
var rt = (() => { class t extends V {
    value;
    _optionMap = new Map;
    _idCounter = 0;
    set compareWith(e) { this._compareWith = e; }
    _compareWith = Object.is;
    writeValue(e) { this.value = e; let i; if (Array.isArray(e)) {
        let r = e.map(s => this._getOptionId(s));
        i = (s, a) => { s._setSelected(r.indexOf(a) > -1); };
    }
    else
        i = r => { r._setSelected(!1); }; this._optionMap.forEach(i); }
    registerOnChange(e) { this.onChange = i => { let r = [], s = i.selectedOptions; if (s !== void 0) {
        let a = s;
        for (let p = 0; p < a.length; p++) {
            let U = a[p], te = this._getOptionValue(U.value);
            r.push(te);
        }
    }
    else {
        let a = i.options;
        for (let p = 0; p < a.length; p++) {
            let U = a[p];
            if (U.selected) {
                let te = this._getOptionValue(U.value);
                r.push(te);
            }
        }
    } this.value = r, e(r); }; }
    _registerOption(e) { let i = (this._idCounter++).toString(); return this._optionMap.set(i, e), i; }
    _getOptionId(e) { for (let i of this._optionMap.keys())
        if (this._compareWith(this._optionMap.get(i)._value, e))
            return i; return null; }
    _getOptionValue(e) { let i = ln(e); return this._optionMap.has(i) ? this._optionMap.get(i)._value : e; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]], hostBindings: function (i, r) { i & 1 && o.\u0275\u0275listener("change", function (a) { return r.onChange(a.target); })("blur", function () { return r.onTouched(); }); }, inputs: { compareWith: "compareWith" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([an]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Kn = (() => { class t {
    _element;
    _renderer;
    _select;
    id;
    _value;
    constructor(e, i, r) { this._element = e, this._renderer = i, this._select = r, this._select && (this.id = this._select._registerOption(this)); }
    set ngValue(e) { this._select != null && (this._value = e, this._setElementValue(Ae(this.id, e)), this._select.writeValue(this._select.value)); }
    set value(e) { this._select ? (this._value = e, this._setElementValue(Ae(this.id, e)), this._select.writeValue(this._select.value)) : this._setElementValue(e); }
    _setElementValue(e) { this._renderer.setProperty(this._element.nativeElement, "value", e); }
    _setSelected(e) { this._renderer.setProperty(this._element.nativeElement, "selected", e); }
    ngOnDestroy() { this._select && (this._select._optionMap.delete(this.id), this._select.writeValue(this._select.value)); }
    static \u0275fac = function (i) { return new (i || t)(o.\u0275\u0275directiveInject(o.ElementRef), o.\u0275\u0275directiveInject(o.Renderer2), o.\u0275\u0275directiveInject(rt, 9)); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["option"]], inputs: { ngValue: "ngValue", value: "value" }, standalone: !1 });
} return t; })();
function ot(t) { return typeof t == "number" ? t : parseInt(t, 10); }
function st(t) { return typeof t == "number" ? t : parseFloat(t); }
var b = (() => { class t {
    _validator = L;
    _onChange;
    _enabled;
    ngOnChanges(e) { if (this.inputName in e) {
        let i = this.normalizeInput(e[this.inputName].currentValue);
        this._enabled = this.enabled(i), this._validator = this._enabled ? this.createValidator(i) : L, this._onChange?.();
    } }
    validate(e) { return this._validator(e); }
    registerOnValidatorChange(e) { this._onChange = e; }
    enabled(e) { return e != null; }
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, features: [o.\u0275\u0275NgOnChangesFeature] });
} return t; })(), un = { provide: d, useExisting: l(() => dn), multi: !0 }, dn = (() => { class t extends b {
    max;
    inputName = "max";
    normalizeInput = e => st(e);
    createValidator = e => Se(e);
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "number", "max", "", "formControlName", ""], ["input", "type", "number", "max", "", "formControl", ""], ["input", "type", "number", "max", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("max", r._enabled ? r.max : null); }, inputs: { max: "max" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([un]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), cn = { provide: d, useExisting: l(() => hn), multi: !0 }, hn = (() => { class t extends b {
    min;
    inputName = "min";
    normalizeInput = e => st(e);
    createValidator = e => Ie(e);
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "number", "min", "", "formControlName", ""], ["input", "type", "number", "min", "", "formControl", ""], ["input", "type", "number", "min", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("min", r._enabled ? r.min : null); }, inputs: { min: "min" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([cn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), fn = { provide: d, useExisting: l(() => at), multi: !0 }, gn = { provide: d, useExisting: l(() => pn), multi: !0 }, at = (() => { class t extends b {
    required;
    inputName = "required";
    normalizeInput = re;
    createValidator = e => Ne;
    enabled(e) { return e; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("required", r._enabled ? "" : null); }, inputs: { required: "required" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([fn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), pn = (() => { class t extends at {
    createValidator = e => Oe;
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("required", r._enabled ? "" : null); }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([gn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), mn = { provide: d, useExisting: l(() => _n), multi: !0 }, _n = (() => { class t extends b {
    email;
    inputName = "email";
    normalizeInput = re;
    createValidator = e => xe;
    enabled(e) { return e; }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]], inputs: { email: "email" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([mn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), vn = { provide: d, useExisting: l(() => yn), multi: !0 }, yn = (() => { class t extends b {
    minlength;
    inputName = "minlength";
    normalizeInput = e => ot(e);
    createValidator = e => Pe(e);
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("minlength", r._enabled ? r.minlength : null); }, inputs: { minlength: "minlength" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([vn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Cn = { provide: d, useExisting: l(() => Vn), multi: !0 }, Vn = (() => { class t extends b {
    maxlength;
    inputName = "maxlength";
    normalizeInput = e => ot(e);
    createValidator = e => Re(e);
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("maxlength", r._enabled ? r.maxlength : null); }, inputs: { maxlength: "maxlength" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Cn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })(), Dn = { provide: d, useExisting: l(() => bn), multi: !0 }, bn = (() => { class t extends b {
    pattern;
    inputName = "pattern";
    normalizeInput = e => e;
    createValidator = e => ke(e);
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275dir = o.\u0275\u0275defineDirective({ type: t, selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]], hostVars: 1, hostBindings: function (i, r) { i & 2 && o.\u0275\u0275attribute("pattern", r._enabled ? r.pattern : null); }, inputs: { pattern: "pattern" }, standalone: !1, features: [o.\u0275\u0275ProvidersFeature([Dn]), o.\u0275\u0275InheritDefinitionFeature] });
} return t; })();
var lt = (() => { class t {
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275mod = o.\u0275\u0275defineNgModule({ type: t });
    static \u0275inj = o.\u0275\u0275defineInjector({});
} return t; })();
function Me(t) { return !!t && (t.asyncValidators !== void 0 || t.validators !== void 0 || t.updateOn !== void 0); }
var ut = (() => { class t {
    useNonNullable = !1;
    get nonNullable() { let e = new t; return e.useNonNullable = !0, e; }
    group(e, i = null) { let r = this._reduceControls(e), s = {}; return Me(i) ? s = i : i !== null && (s.validators = i.validator, s.asyncValidators = i.asyncValidator), new y(r, s); }
    record(e, i = null) { let r = this._reduceControls(e); return new X(r, i); }
    control(e, i, r) { let s = {}; return this.useNonNullable ? (Me(i) ? s = i : (s.validators = i, s.asyncValidators = r), new F(e, h(c({}, s), { nonNullable: !0 }))) : new F(e, i, r); }
    array(e, i, r) { let s = e.map(a => this._createControl(a)); return new T(s, i, r); }
    _reduceControls(e) { let i = {}; return Object.keys(e).forEach(r => { i[r] = this._createControl(e[r]); }), i; }
    _createControl(e) { if (e instanceof F)
        return e; if (e instanceof E)
        return e; if (Array.isArray(e)) {
        let i = e[0], r = e.length > 1 ? e[1] : null, s = e.length > 2 ? e[2] : null;
        return this.control(i, r, s);
    }
    else
        return this.control(e); }
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })(), Jn = (() => { class t {
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: () => P(ut).nonNullable, providedIn: "root" });
} return t; })(), Qn = (() => { class t extends ut {
    group(e, i = null) { return super.group(e, i); }
    control(e, i, r) { return super.control(e, i, r); }
    array(e, i, r) { return super.array(e, i, r); }
    static \u0275fac = (() => { let e; return function (r) { return (e || (e = o.\u0275\u0275getInheritedFactory(t)))(r || t); }; })();
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })(), ei = (() => { class t {
    static withConfig(e) { return { ngModule: t, providers: [{ provide: D, useValue: e.callSetDisabledState ?? B }] }; }
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275mod = o.\u0275\u0275defineNgModule({ type: t });
    static \u0275inj = o.\u0275\u0275defineInjector({ imports: [lt] });
} return t; })(), ti = (() => { class t {
    static withConfig(e) { return { ngModule: t, providers: [{ provide: pe, useValue: e.warnOnNgModelWithFormControl ?? "always" }, { provide: D, useValue: e.callSetDisabledState ?? B }] }; }
    static \u0275fac = function (i) { return new (i || t); };
    static \u0275mod = o.\u0275\u0275defineNgModule({ type: t });
    static \u0275inj = o.\u0275\u0275defineInjector({ imports: [lt] });
} return t; })();
export { E as AbstractControl, W as AbstractControlDirective, ge as AbstractFormDirective, Je as AbstractFormGroupDirective, bt as COMPOSITION_BUFFER_MODE, Ct as CheckboxControlValueAccessor, pn as CheckboxRequiredValidator, u as ControlContainer, v as ControlEvent, we as DefaultValueAccessor, _n as EmailValidator, T as FormArray, Xt as FormArrayDirective, et as FormArrayName, ut as FormBuilder, F as FormControl, Kt as FormControlDirective, tn as FormControlName, y as FormGroup, rn as FormGroupDirective, Qe as FormGroupName, X as FormRecord, j as FormResetEvent, Z as FormSubmittedEvent, ei as FormsModule, Vn as MaxLengthValidator, dn as MaxValidator, yn as MinLengthValidator, hn as MinValidator, C as NG_ASYNC_VALIDATORS, d as NG_VALIDATORS, g as NG_VALUE_ACCESSOR, f as NgControl, Tn as NgControlStatus, Bn as NgControlStatusGroup, Ke as NgForm, Bt as NgModel, Gt as NgModelGroup, Yn as NgSelectOption, Jn as NonNullableFormBuilder, Ht as NumberValueAccessor, bn as PatternValidator, R as PristineChangeEvent, Wt as RadioControlValueAccessor, zt as RangeValueAccessor, ti as ReactiveFormsModule, at as RequiredValidator, it as SelectControlValueAccessor, rt as SelectMultipleControlValueAccessor, M as StatusChangeEvent, k as TouchedChangeEvent, Zn as UntypedFormArray, Qn as UntypedFormBuilder, qn as UntypedFormControl, Hn as UntypedFormGroup, Un as VERSION, _e as Validators, z as ValueChangeEvent, Xn as isFormArray, kt as isFormControl, Ln as isFormGroup, $n as isFormRecord, lt as \u0275InternalFormsSharedModule, zn as \u0275NgNoValidate, Kn as \u0275NgSelectMultipleOption };
/*! Bundled license information:

@angular/forms/fesm2022/forms.mjs:
  (**
   * @license Angular v21.2.17
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
