Bug #001
    Laggy Tab Bar in preview interface
        "Keeps state with most recently clicked element but it has a 2-5second lag at random times when clicking quickly between them"

TYPE 'UI/UX'
CAUSE 'To much stress on the rendering proccess... i.e. display:none to display:flex... position: static etc
Solution 'visibility:hidden, position:absolute, opacity:0, pointer-events:none'
SRC: https://gist.github.com/faressoft/36cdd64faae21ed22948b458e6bf04d5;

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Bug #002
    zoom slider does not reset to center when a different tab is open and a dashboard element is clicked

TYPE 'UI/UX'
CASE #UNKWOWN
MAYBE 'the element wasn't able to be reached because of display none'
SOLUTION #UNKOWN

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Bug #003
    flash of unstyled text when recompiling css

CAUSE 'Missing heights and withs on almost all svgs that are pulled from the database
MAYBE create an adapter for the json model that creates renders and reads the element properties on the client side
SOLUTION 'Recompile JSON with a better cmd script' || ? add default heights and widths before rendering


Bug #005
    copy buttons stopped working for some reason

TYPE 'UI/UX'
CAUSE #UNKOWN
SOLUTION #UNKNOWN

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Bug #006
    the number input drag operations always reset to intial on mouse down instead of continuing from the last position

TYPE 'UI/UX'
SOLUTION 'update intial value on mouseup'

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Bug #007
    Internal state is becoming difficult to manage.

TYPE 'Architecture'
CAUSE 'The props are not properly manage and rely on querying the dom after insertion to know whats happening'
MAYBE 'refactor the createIcon function to an adapter returns an element, props, references, and interface for its own state directly from the data-model/json'
SOLUTION 'use a more structured, programmatic approach, creating instances of self contained components move them around in memory and render changes to the dom on completion'