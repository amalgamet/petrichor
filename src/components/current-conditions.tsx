import { getCurrentConditions } from '@/lib/weather-api';
import {
  degreesToCompass,
  kmhToMph,
  metersToMiles,
  pascalsToInHg,
} from '@/lib/utils';
import { Temperature } from '@/components/temperature';
import { WeatherIcon } from '@/lib/weather-icons';

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
    <div className="md:col-span-5 space-y-6">
      <section>
        <WeatherIcon
          shortForecast={conditions.description}
          size={20}
          aria-hidden
          className="text-muted-foreground"
        />
        <Temperature
          celsius={conditions.temperatureC}
          className="mt-1 text-8xl font-extrabold tracking-tighter sm:text-9xl"
        />
        <p className="mt-1 text-muted-foreground">{conditions.description}</p>
        <p className="mt-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {conditions.stationName}
        </p>
      </section>
      <div className="h-px bg-border" />
      <section>
        <h2>Conditions</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm tabular-nums sm:grid-cols-3">
          {conditions.humidity !== null && (
            <Detail
              label="Humidity"
              value={`${Math.round(conditions.humidity)}%`}
            />
          )}
          {windMph !== null && (
            <Detail
              label="Wind"
              value={`${windDir ?? ''} ${Math.round(windMph)} mph${gustMph !== null ? ` (gusts ${Math.round(gustMph)})` : ''}`}
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
            <Detail
              label="Pressure"
              value={`${pressureInHg.toFixed(2)} inHg`}
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
      </section>
    </div>
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
