/* eslint-disable react/jsx-no-undef */
ReactModal.setAppElement(document.body);

export const ConfigModal = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <div>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                Open Modal
            </button>
            <ReactModal
                isOpen={isOpen}
                // onAfterOpen={afterOpenModal}
                // onRequestClose={closeModal}
                // style=''
                contentLabel="Example Modal"
            >
                <h2>Hello</h2>
                <button
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    close
                </button>
                <div>I am a modal</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </ReactModal>
        </div>
    );
};
