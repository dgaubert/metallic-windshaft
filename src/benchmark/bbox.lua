-- Usage:
--   wrk {endpoint} [{layer} {z} {x} {y} {z-max}] [wrk options]
-- Where:
--   map-config: map config of the map to test (default: simple_map)
--   z: zoom corresponding to the the tile to break down
--   x: coordinate x corresponding to the the initial tile to break down
--   y: coordinate y corresponding to the the initial tile to break down
--   z-max: maximum zoom level to brak down tiles
-- Examples:
--   wrk {endpoint}            {layer} {z}  {x} {y}  {z-max}  [wrk options]
--   wrk http://localhost:8888  admin0  9   145  177   15      --latency -s scripts/bounded_box_map.lua -d 30 -t 4
--   wrk http://localhost:8888  admin1  9   145  177   18      --latency -s scripts/bounded_box_map.lua -d 120

layer = "admin0"

-- whole quad-tree
xmininit = 0
xmaxinit = (2 ^ 18) - 1
ymininit = 0
ymaxinit = (2 ^ 18) - 1
zmininit = 0
zmaxinit = 18

init = function(args)
    if (args[1]) then layer = args[1] end
    if (args[2]) then zmininit = tonumber(args[2]) end
    if (args[5]) then zmaxinit = tonumber(args[5]) end
    if (args[3]) then
        xmininit = tonumber(args[3])
        xmaxinit = xmininit
    end
    if (args[4]) then
        ymininit = tonumber(args[4])
        ymaxinit = ymininit
    end

    xmin = xmininit
    xmax = xmaxinit
    ymin = ymininit
    ymax = ymaxinit
    zmin = zmininit
    zmax = zmaxinit

    x = xmin
    y = ymin
    z = zmin
end

calculateNextCoords = function()
    if (x == xmax) and (y == ymax) then
        if (z < zmax) then
            z = z + 1

            xmin = xmin * 2
            xmax = xmin + (2 ^ (z - zmininit) - 1)
            x = xmin

            ymin = ymin * 2
            ymax = ymin + (2 ^ (z - zmininit) - 1)
            y = ymin
        else
            xmin = xmininit
            xmax = xmaxinit
            ymin = ymininit
            ymax = ymaxinit
            zmin = zmininit
            zmax = zmaxinit

            x = xmin
            y = ymin
            z = zmin
        end
    else
        if (x < xmax) then
            x = x + 1
        else
            x = xmin
            if (y < ymax) then
                y = y + 1
            end
        end
    end
end

request = function()
    path = "/" .. layer .. "/" .. z .. "/" .. x .. "/" .. y ..".png"

    calculateNextCoords()

    return wrk.format(nil, path)
end
