--2/18/25
In the first versions of this application, most of the work was done rather impulsively. I had just spent months, maybe years, learning basic concepts of html, css, and javascript. With all of the things I'd learned there would still be a terror when faced with the challenge of creating real projects. There was always a great tension in creating something new as there were many known unknowns along with unknown unknowns. To cope I would learn new technologies. I picked up sass when the css became to monotonous, tried node when frontend javascript didn't feel like it was enough to get the job done, perused react tutorials when after all of that my code and the resulting projects looked like I had learned nothing at all in all my efforts and plain old javascript just felt confusing.

After noticing the reoccuring theme of starting something only to stop to spend months learning a different concept, then starting something completely different so I didn't have to reflect on my previous shortcommings; I found myself frustrated with not having anything to show for all of the time invested in learning. It seemed as though no matter how tools I learned how to used, no matter how many different languages I learned how to write a for loop in, the results appeared trivial at best. Eventually I found a few small wins in the form of working peices of code, maybe it was novelty in discovering how to show and hide a box on click. The beauty I found in gradients or the potential for creativity uncovered with css tips and tricks. As the snowball grew so did my ideas and at the same rate it became apparent that the possibilities for creativity where infinite, the pain of not having a solid body of work to refect this understanding grew on me. Great games, user interfaces and applications have the uncanny ability to invoke wanderlust onto the user, and while learning to code unveiled the mystery behind it I found myself frustrated that none of the things I'd created could create that same spark.

Thus, this application sprung into life as a result of forcing features into the code editor drawing upon everything that led up to that moment rather haphazardly. Random design patterns learned the week before, strategy patterns borrowed from a tutorial that I vaguely remembered, oneliners that look cool and folder structures that I convinced myself were standard practice because I saw the cool kids doing it. With all of this It felt good because It was solving a problem that actually existed, and was solved with code, I began to trigger that sense of wanderlust in myself, I'd created a desire to explore all that was possible with code. Finding the right icon shouldn't be this hard, I remember thinking. What if I could just find all of the icons on my machine display them in a news feed styled dashboard and do this everytime I downloaded a new set of icons. Surely there is a tool for managing thousands of vector graphics in a streamlined way, to my dismay there was not. Everytime I had to click through the massive amount of files just to see if it was the right icon, my stomach churned as it felt like I would never crack the coding code. My anxiety soon turned to inspiration as I had a good reason to rally all that I'd learned thus far, In a way that myself and others could benifit from, all under one folder, on project to rule them all and I set out to do it without libraries or frameworks. This was it.

20k lines of code in, and I find myself flying through new ideas, spitting out code like a new born that has just been burped. The thrill of building new features with vanilla javascript has now been replaced with the pain of not being able to freely navigate through the spaghetti junction that is my project. It feels like it was yesterday when I was excited to add new functionality then dance in amazement as I had done the thing I thought I'd never be able to do. What I didn't realize is that everytime I bootstraped more functionality to the codebase I was also digging myself into a deeper problem, the problem that makes adding a pain just to think about, the problem in which it appears there aren't any tutorials for. In this world there's only theory and terms that to me are just blog fodder. It only took a few deep dives into terms like hexagonal architecture, mvc, and clean architecture to realize that help was not comming. Sure these things help, but someone in my infantile position can't possibly know which of these will help until you're about 100k lines in. In other words came to believe that I'd need about 5 trys at a painfully large project before I could intuitively decide that I should start the next project using the mmorpg pattern instead of xyz pattern for whatever reason. I'd come to realize that I traded a learning problem for a thinking problem. The thinking problem that is code architecture.


-- 2/29/25

To explain the problem I'm currently facing, knowing 10 ways to do something is good, unless you express 10 different ways to do the same thing within a large codebase. Much of what I'm doing could be simplified if I decided on one naming convention, one pattern for managing the relationships between javascript and html, one way to access and manage the data. I simply didn't know what could be expressed similarly and what was actually different. 

Whats the difference between a modal that renders data and one that is used to manipulate data? what are the similarities that can be expressed in code. What advantages come from creating the html on the fly for different modals within the same function that controls it, what are the disadvantages? Why not just create the html in a separate file importing as needed while creating the functions that control the html in another and yet another for maintaining its relationships to data? Due to my inexperience I find myself asking these questions and subsequently not being able to answer them in the moment they arise; because of this I notice builder-like patterns for one area of the code, yet in another I'll see command and strategy-like patterns for a similar use case. I'll see a good naming convention here and use a totaly different one there because I thought the two components would be different though they turned out to be the same. Not a problem when your 5k lines of code deep but as I come closer to the finish line it feels like I'm conjuring mental energy to solve a problem that was already solved, and as a result wasting time and resources. 

I imagine a world where ideas expressed in code are similar to elements of construction. Concrete is always processed a certain way and applied to certain materials the same way every time. Laying a brick has no random variations within a single blueprint; wood is always stored a certain way cut to standard specs and reshaped as needed; Foundation, Structure, Roofing, Dry wall, in that order everytime and multiple houses may built efficiently in terms of time and energy. If I can apply the organizational methods that a trade organiztion has come to use, I imagine a world where constructing applications can be much more efficient. I now know why many books and blogs are written in this vein, and why none of them can effectively get the message across to someone whos never struggled in a substatial body of code.

As I reflect I realize that my proccess of planning features and applications could use a vast improvement. An architect does not draw up one room of the house, stand back and wait for it to be built before drawing up the next room. If he did I imagine the construction of such house would be as tacky and frustrating as this feels right now. In the end I can say value of this project can rest on this realization at the very minimum, as it currently stands that lesson appears to be invaluable. In my immature opinion, to be a great software engineer is to be a great software architect.

2/25/25
I say this as the project comes to a close, so close to finish that I have no choice but to keep patching sections of code together. Its painful when copy and pasting code that you know isn't up to standard but it works appears to be the most time effective way forward. I imagine this copy pasta approach is one of the main pain most in most software engineering orginizations today and presumably in the future.


2/27/25
As it becomes apparent that a rewrite is out of the question and I stare at the project for hours solutions are popping are beginning to pop out to me about ways to proceed. The main idea is separation of concerns and single responsibility. I've managed to isolate certain patterns in code that can be reorganized for example, why so many classes. I've come to believe that the meat of the application is mainly an api that fetches data, collections that store icons, and icons that may be manipulated. If I can manage to express this in code moving forward should be much simpler. From there I can focus on components that manipulate Icons, components that display them, and components that manipulate where they are stored. This seems like a basic concept but it was apparent during the outset of this application; needless to say I've been feature blind the entire time.

I understand the need for a module that handles api calls, you know where all the api calls are and thats good, but why can't the collection call the api for collection related data?


3/3/25

Running into issues with the speed at which I am recieving icons, it could be due to some bug I introduced on the backend, but that doesn't seem to be the case. I believe that the isp has flagged my route to mongodb for excessive use and thus throttled my transfer speeds, it could also be that the isp is just offering slow tranfer speeds in the general area for what ever reason, I have my suspicions that I may have an intruder of some sort on my machine. In any event it has forced me to shift focus to the way I handle the backend processes. The timing is pretty good because I've just finished the bulk of the fronted updates I wanted to do.

I have some ideas, first I need to finish defining the roles of a collection interface and its relationship to the store and api namely the process for pagination and general data retrieval processes, Next I need to cleanup the code in the server folder with whatever little backend knowledge I currently have. questions to answer this week:

-- how should a structured request, response cycle for a collection/icon look, as I move away  from the fast and rather unefficient methods used in the beginning.

-- when sending multiple icons, do I send only the markup, leaving behind most meta data required for editors to be retrieved on a one off basis?.

-- should I be using redis or some type of cdn


3/12/25

  After spending some time on the server, reoganizing and refactoring for a more modular design. It appears that a simpler approach to managing this application would be to allowing components to fetch their own data from the api...
  instead of forcing index.js to manage all of the relationships with the api/store, instead index.js can just create the components and listen in only when needed.


4/1/25
  I've been avoiding deep comparison of the svg objects for fear of it taking to long, and also fear of userdata
  I've been afraid that this project is reaching it's limits and I will have to learn something else for the sake of creating a desktop app and learning how to secure the application from potential users. Both of which may require learning a new languange and rebuilding the entire project from zero. daunting.
  Also how the heck do you share something like this? what's the process of installing things.

4/3/25

  TODO

--set up wrapper that logs back to the messages ui

--polish and publish prototype (motion/animations)--

--create new user flow--

--setup guest flow for demo with default icon set--

--create landing page--

 GOALS

--Create A Version With Electron--

--Web Facing UI To Safely Drag and Drop Icon Sets--

--Collaboration with Designers to feature new Icon Sets--

--Collaboration with teams to share collections--
