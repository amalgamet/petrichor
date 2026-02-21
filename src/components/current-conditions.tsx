import Image from 'next/image';
import { getCurrentConditions } from '@/lib/weather-api';
import {
  degreesToCompass,
  kmhToMph,
  metersToMiles,
  pascalsToInHg,
} from '@/lib/utils';
import { Temperature } from '@/components/temperature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrentConditionsProps {
  stationsUrl: string;
}

export async function CurrentConditions({
  stationsUrl,
}: CurrentConditionsProps) {
  const conditions = await getCurrentConditions(stationsUrl);

  const windDir = degreesToCompass(conditions.windDirectionDeg);
  const windMph = kmhToMph(conditions.windSpeedKmh);
  const gustMph = kmhToMph(conditions.windGustKmh);
  const visMiles = metersToMiles(conditions.visibilityM);
  const pressureInHg = pascalsToInHg(conditions.pressurePa);

  return (
    <>
      <Card className="flex flex-col items-center justify-center">
        <CardContent className="pt-6 text-center">
          <Image
            src={conditions.icon}
            alt={conditions.description}
            width={96}
            height={96}
          />
          <Temperature
            celsius={conditions.temperatureC}
            className="mt-2 text-6xl font-bold"
          />
          <p className="mt-1 text-lg text-muted-foreground">
            {conditions.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {conditions.stationName}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm tabular-nums">
            {conditions.humidity !== null && (
              <Detail
                label="Humidity"
                value={`${Math.round(conditions.humidity)}%`}
              />
            )}
            {windMph !== null && (
              <Detail
                label="Wind"
                value={`${windDir ?? ''} ${Math.round(windMph)}\u00a0mph${gustMph !== null ? ` (gusts ${Math.round(gustMph)})` : ''}`}
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
              <Detail
                label="Visibility"
                value={`${visMiles.toFixed(1)}\u00a0mi`}
              />
            )}
            {pressureInHg !== null && (
              <Detail
                label="Pressure"
                value={`${pressureInHg.toFixed(2)}\u00a0inHg`}
              />
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
    </>
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
