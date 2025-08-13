const MessageDisplay = ({ message, onClose }) => {
  if (!message.show) return null;

  return (
    <div className={`mb-4 p-4 rounded-lg border transition-all duration-300 ${
      message.type === 'success' 
        ? 'bg-green-900/20 text-green-400 border-green-600' 
        : 'bg-red-900/20 text-red-400 border-red-600'
    }`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{message.text}</span>
        <button 
          onClick={onClose}
          className="ml-3 text-current hover:opacity-70 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageDisplay;
