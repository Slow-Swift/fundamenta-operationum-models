
## Proposition 2 & 5 & 6
- Is Ecliptic Distance the right name for the slider?
- Ecliptic distance ranges from -179-179 to avoid ambiguity at +-180
- When ecliptic distance is negative the triangle has negative side lengths. Should I make them positive?

## Proposition 3
- When declination is negative the triangle has negative side lengths. Should I make them positive?

## Proposition 4
- Is moon distance the right name for the slider?
- When moon distance is negative the triangle has negative side lengths. Should I make them positive?

## Proposition 5 & 6
- Same notes as P2

## Proposition 7
- In the original text, Reggie specifies that H is on the southern half of the ecliptic. In this
    model I've allowed it to be on the north half as well. Should I undo that?
- Because H is a point on the ecliptic declination is clamped to the range (-23.5, 23.5) or (-lat, lat)
    whichever is less. Should the range just be (-lat, lat)?
- When declination is positive should H be on the right or left?
- Should I add the ecliptic through H as a thin line? (See discussion in P8)

## Proposition 8
- Do we want to add the ecliptic as a thin line? This would allow me to draw the calculated distance.
- For a given ortive amplitude there are actually 0-2 possible ecliptics. If the calculated declination
    is greater than the ecliptic obliquity then there is no possibility. If the declination equals
    the ecliptic obliquity then there is one possibility, otherwise there are 2. 
    Is there a way to select one or should I draw both?
- What range should I use for ortive amplitude? I've currently set it to (-90, 90) but Reggies discussion
    assumes H is in the south. Additionally, as noted above not all ortive amplitudes correspond to 
    points on the ecliptic. I could restrict it to a range that always has an ecliptic but without
    this would result in a slider range that changes based on latitude.
- If I don't draw the ecliptic then I can only really do the first part of the proposition (calculating declination)
    which is actually the only part the Reggie properly explains.

## Proposition 9
- Similar questions as P8 with relation to ecliptic and ortive amplitude
- Reggie splits this into two cases: When H is south of E and when H is north of E. I've combined
    them into one model using labels for the south side but allowing ortive amplitude to be negative.

## Proposition 10
- I don't understand either the original text or Mark Takken's analysis
- Do I need a different model from P9?

## Proposition 11
- I've only drawn half the proposition because allowing the oblique ascension to be negative
    allows both to be modelled with less clutter.
- When the oblique ascension is negative the calculated arcs are negative. Should I leave it so or 
    take their absolute values.

## Proposition 14
- When latitude = 90, the altitude is undefined which means things like the altitude label dissappear.
    Currently I've set it to 90 in such a case since that is the limit as latitude approaches 0. 
    Should I instead just display "Undefined"?
