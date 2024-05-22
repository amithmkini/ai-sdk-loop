import Image from "next/image"

interface SearchContactsProps {
  users: {
    name: string;
    username: string;
    avatar: string;
  }[];
}

export function SearchContacts({ users }: SearchContactsProps) {
  return (
    <div className="bg-zinc-100 rounded-lg flex flex-col">
      {users.map((user, index) => (
        <div key={index} className="flex flex-row justify-between p-2 first:border-b items-center">
          <div className="flex flex-row gap-2 items-center">
            <div className="size-6">
              <Image className="size-6 w-full h-full rounded-sm" src={user.avatar} alt={user.name} width={44} height={44} />
            </div>
            <div className="capitalize text-sm text-zinc-700">{user.name}</div>
          </div>
          <div className="text-zinc-500 text-sm">
            {user.username}
          </div>
        </div>
      ))}
    </div>
  )
}