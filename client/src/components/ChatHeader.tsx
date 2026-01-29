// import { X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  if (!selectedUser) return;
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar flex items-center">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || '/avatar.png'}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium flex items-center gap-2">
              {selectedUser.fullName}{' '}
              {selectedUser.isVerified && (
                <img
                  src="https://liderposm.ru/upload/iblock/ec4/6o0uuv1axgtdzsf9q6c0bti4r2eu6pk6/Galochka.png"
                  className="size-4 inline-block"
                />
              )}
            </h3>

            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        {/* TODO: */}
        {/* <button
          onClick={() => {
            setSelectedUser('');
          }}
        >
          <X />
        </button> */}
      </div>
    </div>
  );
};

export default ChatHeader;
