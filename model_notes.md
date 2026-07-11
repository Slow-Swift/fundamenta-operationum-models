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


