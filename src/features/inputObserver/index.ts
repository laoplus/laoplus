const isInputElement = (target: EventTarget | null) => {
    if (target === null) return false;
    const t = target as HTMLElement;
    if (t.tagName !== "INPUT") return false;
    return t as HTMLInputElement;
};

const getCursorPosition = (element: HTMLInputElement) => {
    const cursorPosition = element.selectionStart;
    if (cursorPosition === null) {
        throw new Error("cursor position should not be null");
    }
    return cursorPosition;
};

// https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js#46012210
const getNativeInputValueSetter = () => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    )?.set;
    if (!nativeInputValueSetter) {
        throw new Error("nativeInputValueSetter is not found");
    }

    return nativeInputValueSetter;
};

const dispatchEvent = (input: HTMLInputElement, newValue: string) => {
    const nativeInputValueSetter = getNativeInputValueSetter();
    nativeInputValueSetter.call(input, newValue);
    const inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
};

const keypressObserver = () => {
    // prettier-ignore
    // addEventListenerで改行されるとネストが深くなるため
    unsafeWindow.addEventListener("keypress", ({ key, target: eventTraget }) => {
        const target = isInputElement(eventTraget);
        if (!target) return;

        // dispatchした時点でカーソルの位置が吹っ飛んでしまうのでここで抑えておく
        const cursorPosition = getCursorPosition(target);

        const lastValue = target.value;
        const newValue = [
            ...[...lastValue].slice(0, cursorPosition),
            key,
            ...[...lastValue].slice(cursorPosition),
        ].join("");
        dispatchEvent(target, newValue);

        target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    });
};

const keydownObserver = () => {
    unsafeWindow.addEventListener("keydown", ({ key, target: eventTraget }) => {
        const target = isInputElement(eventTraget);
        if (!target) return;

        if (
            !(
                key === "ArrowRight" ||
                key === "ArrowLeft" ||
                key === "Backspace"
            )
        ) {
            return;
        }

        const cursorPosition = getCursorPosition(target);
        let newCursorPosition;

        if (key === "Backspace") {
            const lastValue = target.value;
            const newValue = [
                ...[...lastValue].slice(0, cursorPosition - 1),
                ...[...lastValue].slice(cursorPosition),
            ].join("");
            dispatchEvent(target, newValue);
        }

        if (key === "ArrowRight") {
            newCursorPosition = cursorPosition + 1;
        } else {
            // Backspace, ArrowLeftで共通
            // 左端で左を押したとき、0未満にならないようにする
            newCursorPosition =
                cursorPosition - 1 >= 0 ? cursorPosition - 1 : cursorPosition;
        }

        target.setSelectionRange(newCursorPosition, newCursorPosition);
    });
};

export const initInputObserver = () => {
    keypressObserver();
    keydownObserver();
};
