interface LocationItemProps {
  name: string
  distance: string
}

interface SearchNearbyProps {
  locations: { name: string; distance: string }[]
}

function LocationItem({ name, distance }: LocationItemProps) {
  return (
    <div className="flex flex-row justify-between p-2 first:border-b">
      <div className="flex flex-row gap-2">
        <div className="capitalize text-zinc-700 text-sm">{name}</div>
      </div>
      <div className="text-zinc-500 text-sm">{distance}</div>
    </div>
  )
}

export function SearchNearby({ locations }: SearchNearbyProps) {
  return (
    <div className="bg-zinc-100 rounded-lg flex flex-col">
      {locations.map((location, index) => (
        <LocationItem key={index} name={location.name} distance={location.distance} />
      ))}
    </div>
  )
}
