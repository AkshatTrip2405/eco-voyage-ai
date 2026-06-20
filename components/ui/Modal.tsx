type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-black"
          >
            ✕
          </button>
        </div>

        <div className="text-black">
          {children}
        </div>
      </div>
    </div>
  );
}