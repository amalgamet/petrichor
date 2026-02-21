import Image from "next/image";
import { getCurrentConditions } from "@/lib/weather-api";
import { degreesToCompass, kmhToMph, metersToMiles, pascalsToInHg } from "@/lib/utils";
import { Temperature } from "@/components/temperature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrentConditionsProps {
  stationsUrl: string;
}

export async function CurrentConditions({ stationsUrl }: CurrentConditionsProps) {
  const conditions = await getCurrentConditions(stationsUrl);

  const windDir = degreesToCompass(conditions.windDirectionDeg);
  const windMph = kmhToMph(conditions.windSpeedKmh);
  const gustMph = kmhToMph(conditions.windGustKmh);
  const visMiles = metersToMiles(conditions.visibilityM);
  const pressureInHg = pascalsToInHg(conditions.pressurePa);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Conditions</span>
          <span className="text-sm font-normal text-muted-foreground">
            {conditions.stationName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Image
            src={conditions.icon}
            alt={conditions.description}
            width={80}
            height={80}
            className="shrink-0"
          />
          <div>
            <Temperature celsius={conditions.temperatureC} className="text-5xl font-bold" />
            <p className="mt-1 text-lg text-muted-foreground">{conditions.description}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {conditions.humidity !== null && (
            <Detail label="Humidity" value={`${Math.round(conditions.humidity)}%`} />
          )}
          {windMph !== null && (
            <Detail
              label="Wind"
              value={`${windDir ?? ""} ${Math.round(windMph)} mph${gustMph !== null ? ` (gusts ${Math.round(gustMph)})` : ""}`}
            />
          )}
          {conditions.dewpointC !== null && (
            <div>
              <span className="text-muted-foreground">Dew Point</span>
              <div className="font-medium">
                <Temperature celsius={conditions.dewpointC} />
              </div>
            </div>
          )}
          {visMiles !== null && (
            <Detail label="Visibility" value={`${visMiles.toFixed(1)} mi`} />
          )}
          {pressureInHg !== null && (
            <Detail label="Pressure" value={`${pressureInHg.toFixed(2)} inHg`} />
          )}
          {conditions.windChillC !== null && (
            <div>
              <span className="text-muted-foreground">Wind Chill</span>
              <div className="font-medium">
                <Temperature celsius={conditions.windChillC} />
              </div>
            </div>
          )}
          {conditions.heatIndexC !== null && (
            <div>
              <span className="text-muted-foreground">Heat Index</span>
              <div className="font-medium">
                <Temperature celsius={conditions.heatIndexC} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
