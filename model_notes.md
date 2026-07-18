## Overall
- What to do about negative sidelengths?
- What about negative parameters?

## Proposition 7
- In the original text, Reggie specifies that H is on the southern half of the ecliptic. In this
    model I've allowed it to be on the north half as well. Should I undo that?
- Because H is a point on the ecliptic declination is clamped to the range (-23.5, 23.5) or (-lat, lat)
    whichever is less. Should the range just be (-lat, lat) since the mathematics works the same?
- When declination is positive should H be on the right or left?

## Proposition 8
- What range should I use for ortive amplitude? I've currently set it to (-90, 90) but Reggie's discussion
    assumes H is in the south. Additionally, not all ortive amplitudes correspond to 
    points on the ecliptic. I could restrict it to a range that always has an ecliptic but 
    this would result in a slider range that changes based on latitude in way that is not super clear to the user.
- If I don't draw the ecliptic then I can only really do the first part of the proposition (calculating declination)
    which is actually the only part the Reggie properly explains.

## Proposition 9
- Reggie splits this into two cases: When H is south of E and when H is north of E. I've combined
    them into one model using labels for the south side but allowing ortive amplitude to be negative.

## Proposition 10
- I don't understand either the original text or Mark Takken's analysis
- Do I need a different model from P9?

## Proposition 11
- I've only drawn half the proposition because allowing the oblique ascension to be negative
    allows both to be modelled with less clutter.

## Propositions 7-11
These refer to a point on the ecliptic as it crosses the horizon. However the ecliptic is not
shown on the diagrams. This does make it harder to understand for the user. There is a possibility
of drawing in the ecliptic (perhaps as a thin line) but I'm not sure how complex that would be.
I think in some cases there is not a unique possibility and there are 0-2 possibilities for the ecliptic.
If I did draw them in then we'd have to decide how to find the ecliptic and choose just one possibility.
Could maybe just describe in prose about the point.

## Proposition 14
- When latitude = 90, the altitude is undefined which means things like the altitude label dissappear.
    Currently I've set it to 90 in such a case since that is the limit as latitude approaches 0. 
    Should I instead just display "Undefined"?

## Proposition 15
I used time as the parameter which controls the angle of Z so that at 12 (noon) the sun crosses
the meridian and also at 0 (midnight). If declination is 0 then the sun rises at 6.

Its slightly confusing since the equator isn't depicted. For example Reggie says angle OZS is the
distance of the sun from the meridian, but he isn't referring to the shortest (great circle) distance, 
rather the distance the earth must rotate for it to reach the meridian, the distance when projected onto the 
equator, or equivalently the distance along a latitude line (small circle).

Additionally, one of the parameters is the declination of the sun to the equator but the equator
is not pictured.

## Proposition 17
This problem is especially confusing since Reggie uses point E which has thus far been the east point
of the equator or horizon. In this case however, E is a point on the ecliptic which can move along 
the horizon. Additionally, since Proposition 16 is used, one of the parameters is the ecliptic longitude
however, the equator is not drawn so there is no point to measure the ecliptic longitude from which
makes it even more confusing. 
Determining where point E should be on the horizon based on latitude and ecliptic longitude has 
caused me no end of trouble, but I did finally manage it by working out where the Vernal equinox
would be and placing E based of off that. (See Proposition 17 with Equator for a visual of this).
Finally, for some latitude and longitude combinations there is no case where the selected point on the ecliptic
crosses the horizon. For this reason I have just restricted the latitude slider so that is never the case.

## Proposition 18
TODO:

## Proposition 19
It took me quite a while to understand this and the text has some rather confusing parts so I've
included detailed notes about my understanding of the problem. The big issue with the model right
now is the issue of parameters and the way the point altitude parameter jumps around as other
parameters are moved (See the first section below).

### The parameters

Reggie uses the altitude of the ecliptic on the meridian, the angle of the ecliptic with the 
meridian, and the altitude of the chosen point on the meridian as parameters. These are confusing
to use for the model since it isn't clear how one would obtain values for those parameters. Worse
the allowable range for the altitude of the point is the complement of HK which is indirectly derived
from the parameters. This means that the range for that slider changes in an unclear fashion based 
on the other sliders. Furthermore because I restricted sliders to a scale of 0.1 but HK is real you
usually cannot set the slider for altitude to the theoretical maximum (you can only set it to the closest 0.1).

Should I work out how to calculate this values from latitude, and ecliptic longitude? Will there 
then be any difference between this and Proposition 18.

## East Point verses Ascendent

Reggie says 

>This is subtracted from two right \[angles\] if the given point is less than 90° from 
> the east; or it itself is the sought angle
> if the given point is more than 90° removed from the ascendent.

Here he references both the East point and the ascendent. From this paragraph it seems like 
this should be the same, however the ascendent is E but E is not the east point of the horizon.
However, K is always 90 degrees away from E and if L is on the other side of K from E then HLK is
indeed the sought angle as Reggie says. So it seems that he meant E by both "the east" and "the ascendent"
as Mark Takken assumed.

However, with the parameter of altitude of the given point, there are always two possibilities for
the actual point. One within 90 degrees of E and the other more than 90 degrees from E. In particular
there are often two possibilities in the eastern hemisphere (one on each side of K). In the model I've
made this makes it impossible to specify a point to the left of K. 

## North and South

Reggie says:

> Indeed all these matters apply when the point of the ecliptic is positioned on the meridian,
> inclined from the vertex of the head toward the southern region.
> For in contrast if it were to incline to the north, everything is reversed.

This confused me for a while, but I think vertex of the head is the zenith (H) and if the point of
the ecliptic is inclined towards the south, then A is south of H (towards B) otherwise it is towards C.
This allows Reggie to restrict ecliptic angle to < 90 and if you had a case where it was > 90,
you would flip the entire model and put A between H and C.

## Proposition 21
There are two possibilities for L. One on each side of the sphere. I have elected to always 
have it on the east side of the sphere.

## Proposition 29
Mark Takken assumes that the parameters are oblique ascension, right ascension, and declination,
however Reggie seems to imply that the parameters are oblique ascension, and ecliptic longitude,
from which the right ascension and declination can be determined.

The result is chaotic at 0, 0 and 0, 180 so I don't let the parameters go all the way to those values.

## Proposition 30

This problem is quite confusing.
Mark Takken assumes that we know both the oblique ascension and right ascension of H but if we know 
the right ascension then we would be able to determine the ecliptic longitude of H and the problem
reduces to P29. So we must not know the right ascension of H.

Reggie says we are given an arc of the ecliptic beginning at a point other than the intersection 
with the equator together with its oblique ascension. 
I would interpret this as giving the oblique ascension of H together with the length of the arc of the 
ecliptic HL.

Reggie then notes that the ecliptic arc starts at H and ends at L. His diagram puts L on the 
horizon (unless BED is not the horizon in this diagram), but this would put HL (an arc of the ecliptic)
on the horizon which can only occur for latitude = 66.5.

But then Reggie says that KM is the difference between the oblique ascension (which was given) and 
the right ascension of the arc. As noted above I don't think this right ascension can be given but I
don't understand how Reggie's statement makes any sense. Even if we were given the right ascension of 
H the difference between the given oblique ascension and the right ascension would be EK not KM. 
If instead we had the right ascension of L this would give EM. The only way it makes sense is if the 
diagram is understood differently and the horizon actually passes through KL and we are given the oblique
ascension of L instead of H, but even this doesn't make much sense.

Given the length HL we could calculate the right ascension of the arc assuming H was at the equinox.
Maybe combining this with the oblique ascension somehow gives KM.

There is then an error in translation. "sinus arcus ZL complementi declinatis maioris" is translated 
as "the cosine of arc ZL, the maximum declination" but should instead be "the sine of arc ZL, the complement
of the maximum declination". Also it is possible that the "maximum declination" should actually be 
the "larger declination" as if it is the maximum possible declination (23.5) then that fixes L, and 
we can then easily work out the ecliptic longitude of H and are back to proposition 29. This is further 
reinforced by Reggie later referring to the lesser declination "HK".

I am also not sure how either of these declinations may be calculated without more easily being 
able to use P29.

Also what! He says there is no problem if ark ZK exceeds a quadrant. That implies that AEC is not the
equator. What is happening??

