
import { useState } from "react"
import { Button } from "./ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";


const CitySearch = () => {

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const { data: locations, isLoading } = useLocationSearch(query);
    //const { favorites } = useFavourites();
    const { history, clearHistory, addToHistory } = useSearchHistory();

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|");

        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country
        })

        setOpen(false)
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
    }


    return (
        <>
            <Button
                variant="outline"
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64" 
                //How it behaves across screen sizes
                /*| `<640px` (mobile) | No `pr-12`, no `w-40`, no `w-64`    |
                   | `≥640px` (small)  | `pr-12` only                        |
                   | `≥768px` (medium) | `pr-12` + `w-40`                    |
                   | `≥1024px` (large) | `pr-12` + `w-64` (overrides `w-40`) |
                */
                onClick={() => setOpen(true)}>
                <Search className="mr-2 h-4 w-4"/>
                Search Cities...
            </Button>


            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                <CommandInput 
                    placeholder="Search Cities.." 
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {/*long letters or not loading*/}
                    {query.length > 2 && !isLoading && (
                        <CommandEmpty>No cities found.</CommandEmpty>
                    )}

                    {/*{favorites.length > 0 && (
                        <CommandGroup heading="Favorites">
                            {favorites.map((city) => (
                            <CommandItem
                                key={city.id}
                                value{`${city.lat}|${city.lon}|${city.name}|${city.country}
                                onSelect={handleSelect}>

                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>{city.name}</span>
                                {city.state && (
                                <span className="text-sm text-muted-foreground">
                                    , {city.state}
                                </span>
                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>{city.name}</span>
                        {city.state && (
                        <span className="text-sm text-muted-foreground">
                            , {city.state}
                        </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                        , {city.country}
                        </span>
                    </CommandItem>
                    ))}
                </CommandGroup>
                )}
                                }))}
                    )}*/}

                    {history.length > 0 && (
                        <>
                            <CommandSeparator/>
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">
                                        Recent Searches

                                    </p>
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearHistory.mutate()}>
                                            <XCircle className="h-4 w-4"/>
                                            Clear
                                    </Button>
                                </div>
                                {history.map((item) => (
                                    <CommandItem
                                    key={item.id}
                                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                    onSelect={handleSelect}
                                    >
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{item.name}</span>
                                    {item.state && (
                                        <span className="text-sm text-muted-foreground">
                                        , {item.state}
                                        </span>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        , {item.country}
                                    </span>
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {format(item.searchedAt, "MMM d, h:mm a")}
                                    </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                    <CommandSeparator />
                    {locations && locations.length > 0 && (
                        <CommandGroup heading="Suggestions">
                        {isLoading && (
                            <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                        )}
                        {locations?.map((location) => (
                            <CommandItem
                                key={`${location.lat}-${location.lon}`}
                                value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                onSelect={handleSelect}
                            >
                            <Search className="mr-2 h-4 w-4" />
                            <span>{location.name}</span>
                            {location.state && (
                            <span className="text-sm text-muted-foreground">
                                , {location.state}
                            </span>
                            )}
                            <span className="text-sm text-muted-foreground">
                            , {location.country}
                            </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    )}
            </CommandList>
            </Command>
        </CommandDialog>
    </>
  );
}
export default CitySearch
