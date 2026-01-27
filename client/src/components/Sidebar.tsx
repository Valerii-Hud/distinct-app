import { useEffect } from 'react';
import useChatStore from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
  const {
    getUsers,
    isUsersLoading,
    users,
    setSelectedUser,
    selectedUser,
    onlineUsers,
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20  lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => setSelectedUser(user._id)}
          className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${selectedUser === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
    `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user.profilePic || '/avatar.png'}
              alt={user.fullName}
              className="size-12 object-cover rounded-full"
            />
            {onlineUsers.includes(user._id) && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
            )}
          </div>

          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-sm text-zinc-400">
              {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
            </div>
          </div>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
