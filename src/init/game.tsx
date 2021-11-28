import { log } from "../utils/log";

export const initGamePage = () => {
    GM_addStyle(`
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        line-height: 0;
    }
    .webgl-content {
        position: unset;
        -webkit-transform: unset;
        transform: unset;
    }`);

    // GM_addStyle(`
    // .laoplus-modal {
    //     display:none;
    // }
    // .laoplus-modal.is-open {
    //     display: block;
    // }
    // button[data-micromodal-close]:before {
    //     content: "\\2715";
    // }`);

    // const addModalElement = () => {
    //     const modalHtml = `
    //     <div id="laoplus-modal" aria-hidden="true" class="laoplus-modal">
    //         <div tabindex="-1" class="fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center">
    //             <div role="dialog" aria-modal="true" aria-labelledby="laoplus-modal-title" class="bg-gray-50 p-4 rounded shadow max-w-[90%] max-h-[90%] overflow-auto flex flex-col gap-2">
    //                 <header class="flex place-content-between items-center">
    //                     <div class="flex gap-2 items-end">
    //                         <h2 id="laoplus-modal-title" class="font-semibold text-xl">LAOPLUS</h2>
    //                         <span class="text-sm text-gray-500 pb-0.5">${GM_info.script.version}</span>
    //                     </div>
    //                     <button aria-label="Close modal" data-micromodal-close></button>
    //                 </header>
    //                 <div class="my-2 border-t"></div>
    //                 <div id="laoplus-modal-content">
    //                     <div class="flex flex-col ml-6">
    //                         <label class="flex gap-2 items-center">
    //                             <input type="checkbox" id="laoplus-discord-notification" class="w-4 h-4 -ml-6">
    //                             <span>Discord通知</span>
    //                         </label>
    //                         <label class="flex gap-2">
    //                             <span>Discord Webhook URL:</span>
    //                             <input type="text" id="laoplus-discord-webhook-url" class="w-48 border-gray-500">
    //                         </label>
    //                     </div>
    //                 </div>
    //                 <div class="my-2 border-t"></div>
    //                 <footer>
    //                     <a href="${GM_info.script.homepage}" target="_blank" class="text-gray-500 text-sm">GitHub</a>
    //                 </footer>
    //             </div>
    //         </div>
    //     </div>
    //     `;
    //     document.body.insertAdjacentHTML("beforeend", modalHtml);
    // };
    // addModalElement();

    // const addLaoplusButton = () => {
    //     const html = `<button class="laoplus-button absolute bottom-0 left-0 transition" data-micromodal-trigger="laoplus-modal">➕</button>`;
    //     document.body.insertAdjacentHTML("beforeend", html);
    // };
    // addLaoplusButton();

    log("Game Page", "Style injected.");
};
