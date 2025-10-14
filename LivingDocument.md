# **GPTree: Living Document**

## **1\. Team info:**

* Brittan Wadsworth: [ Frontend / Backend ]
* Richman Pham: [ UI designer / Frontend  ]
* Yana Martynyuk: [ UI designer / Frontend ]
* Jungho Park: [ Backend ]
* Jackson Tyler Lee Kent: [ Backend ]

Github: [https://github.com/Britwad/GPTree](https://github.com/Britwad/GPTree)

We are using a Discord server as our primary communication tool. Members have agreed to operate with the following policy:

- Active hours are defined to be from 8am to 8pm Monday through Friday
- A message in need of response can not be left unanswered for more than 6 active hours
- A message using @ to refer to a team member by name must get a response from that member within 4 active hours
- Team members will use each channel for its designated purpose, and will create a new channel if deemed helpful
- Team members should still feel free to message and respond outside of active hours
- Team members acknowledge that quick responses are extreamely helpful for the group cause, and will make efforts to respond sooner than later, especially for time-sensitive tasks.

## **2\. Product description:**

**Abstract**:   
ChatGPT and other LLMs are incredible tools for conversational learning. They provide the user with the opportunity to pursue personal learning at their own pace on their own time. However, ChatGPT currently does not cover all the needs of those interested in personal learning. It is difficult to explore previous conversations, and users often only read the results of an LLM once. GPTree aims to solve these issues, and to create a cohesive framework for learning. Learning node by node, asking follow-up questions, users will effectively be generating their own personal textbooks. Under this framework, there are many additional features that can be incorporated. These include flashcard generations, tests of understanding, and utilization of space repetition learning principles to encourage long term understanding. This platform aims to be as broad as possible, without specific topics or courses, and will only restrict users when they are not requesting informative content.

**Goal:**   
Provide a cohesive framework that encourages and empowers user’s personal learning with long-lasting knowledge retention. This framework will make learning any topic feel less intimidating, and additionally will provide further support to ensure that the first time the user hears about a concept won’t be the last.

**Current Practice:**   
While there are an array of existing tools for education using AI, these tools are often scope limited, still exist essentially through a chat window, and typically are specialized towards schoolwork. Some examples include:

- ChatGPT Study mode, is a specialized chat window that emphasizes understanding rather than immediate answers
- Oboe.fyi Generates a course upon user request that can be revisited, with potential follow up courses
- YouLearn.ai Helps you understand your schoolwork by letting users upload textbooks or videos as reference points to be broken down and understood.
- Learningro.com Uses AI to create personal learning experiences for students and to help teachers.

For users who go to ChatGPT or other major LLMs to learn, they often get overwhelmed with the quantity of information that results. It can be easy to lose track of what ground has been covered, and there is little to no accountability for knowledge retention. These other platforms are often scope limited to just school, with a focus on personalized learning experiences.

**Novelty**:  
The novelty of our approach comes from a tree-structure of learning. Each tree will represent a new exploration of a subject. Learning will be done node by node, where each node contains LLM generated information. Each node will give users the option for further learning either through flashcards, tests, or further questions. Further questions and clarifications will lead to the creation of a new node. As users explore a topic they will be able to see visible progress of what they have learned, and how it all connects. Furthermore, GPTree will have a place for users to go to practice concepts they have covered over all of their trees (topics). Here either flashcards or even more qualitative questions will be used to help users test their knowledge over wider gaps of time, ultimately cementing concepts in long term memory.

**Effects:**  
It is increasingly becoming the case that people resort to GPTs for day to day searching rather than an actual search engine. For those exploring the internet with the aim to learn more about a topic, we aim to be the place where that learning happens. We aim to ensure that GPTree always sports the latest model with the latest capabilities (including internet search and file reference). Our app will encourage actual and effective learning, of up to date information, rather than just immediate results that are quickly read and forgotten. Effectively, users will be generating a neatly structured textbook, making revisiting previous knowledge more convenient. Additionally with spaced repetition learning, users will be able to reinforce their knowledge of any topic they choose.

**Risks:**  
The most serious challenge or risk faced will be setting guardrails on LLM outputs to ensure consistently helpful outputs for any inputs the user may give. Relying on generated outputs for flexibility can lead to powerful products, but there is inevitable unpredictability that must be accounted for. LLM models are also not 100% correct all the time, the information collected and produced by the model cannot be guaranteed to be entirely factual. This potential inaccuracy may lead users to seek more reputable sources such as online textbooks and tutorials.  
To mitigate risks related to LLM output variability, we will do the following:

* Note to users that outputs are never guaranteed to be trustworthy, and that important information should be fact checked. This is the industry standard for LLM outputs (OpenAI has: “ChatGPT can make mistakes. Check important info.”)  
* Use a carefully engineered system prompt for the LLM that strictly requires all outputs to be educational, with pre-written responses for inputs that seem irrelevant or inappropriate to the task.  
* There is also the potential solution for LLM outputs to include an error message as part of a structured output, that then can be caught prior to generation to throw an error.

**Major Features:**

* Dedicated web app with intuitive UI/UX that combines the following features.
* Tree based navigation page will give organization to the user’s interaction with the chatBot.   
* Generation of potential follow-up questions with the option for users to ask their own. Each follow up question will lead to the creation of a new node with a new block of generated text answering the question.  
* Each node will be associated with a set of flash cards, and users will have the chance to review these flash cards to test their knowledge.  
* There will be a dedicated page for spaced repetition learning, where concepts from any tree the user has generated will be collected for the user to be tested on. The user will have control over which trees they want to be practicing.

**Stretch Goals:**

* Complementary mobile app sharing similar UI. The main benefit of this app is that users will be able to practice their concepts and flash cards while on the go.  
* The option to generate tests either based on a single node or a tree. The users then can take this test, which may not be necessarily multiple choice questions, and it will be graded partially by the program and also by an LLM for short-answer questions.
* Incorporating more multimodal features of LLMs such as vision, image generation, etc.
* Implementing social features such as sharing or publishing trees for others to view.

**Additional comments:**

* A new node is created off of an existing node whenever a follow up question is asked relative to a node. For example if a user had a node about eigenvectors, a new node could be created after asking “what is a determinant” inside the “eigenvector” node.  
* A single node finishes generation once the LLM is done responding (it usually finishes on its own, and for rare cases we can have a max-output length).  

## **3\. Use Cases (Functional Requirements):**

### **3.0. Pages and Visual Elements**

#### Pages
- **View Tree** - Here users will be presented with a visual tree of the generated nodes, they will have the option to click on nodes, or to create a new node off of an existing node by asking a follow-up question.
  - **View Node** - Here users will see the generated text response from the LLM of the answer to their question. Each Node will consist of a Title, Question, Text, Key Points Summary, and Generated follow-up questions.
  - **View Flashcards** Here users can view a set of **flashcards** either specific to the tree or specific to a single node.
- **Spaced Repetition Page** - Here users will be presented a feed of **Flash Cards** based on the trees that they have generated. These **Flash Cards** will be presented using a spaced repetition scheduler, which will keep track of the user's success rate in remembering the information on the flash card.


#### Visual Elements
- **Node** - A clickable element that contains a single LLM generation of text relevant to the user's topic of interest. From any node users can ask "follow-up questions" that lead to the creation of a new, and connected, node whose generated text answers the follow up question. Users can generate a set of Flashcards based on the information contained in a node.
- **Tree** - A set of connected **Nodes**, with a root **Node**. The main functionality of **Gptree** is letting user's create, expand, and navigate these **trees**.
- **Flash Card** - A flash card represents a question / answer pair of text, which will be generated by an LLM to help users review and study information from **Nodes** or **Trees**. 

*All following use cases will be between two actors: **User** and **System***

### **3.1. User Sign in / Sign up**

**Triggers**

* User clicks "Get Started" button

**Preconditions**

* User is on landing page
* User is not signed in

**Postconditions (success scenario)**

* User is signed into their account, using their google account, and can now create a tree. If they had not created an account before, a new user entity is associated with their email.

**List of steps (success scenario)**

1. System: Presents "Continue with Google" button that uses NextAuth.js
2. User: Clicks button
3. System: Prompts user to sign in with their google account, and asks for information/permissions
4. User: Enters information, gives permissions
5. System: NextAuth.js authenticates information, then passes user inf`ormation to server
5. System: A cookie is set so that frontend has access to which user is using site. Routes to landing page where user can create tree associated with their account.

**Extensions/variations of the success scenario**

* The user wants to login using just their email, not necesarily google. They can "Continue with email", then they will recieve an email with a one-time login url. They will have to repeat this process to sign in for future cases.
* User previously used "continue with google" but this time they use "continue with email" with the same address. They will still be connected to the correct account, with a different OAuth method.

**Exceptions: failure conditions and scenarios**

* The user provides an invalid email address. In this case we will display an error message for the user telling them to try again with valid input.

### **3.2. Create a Tree**

**Triggers**

* User clicks “New Tree” button

**Preconditions**

* User has created an account on GPTree

**Postconditions (success scenario)**

* There now exists a tree entity related to at least one node, where the node contains information relevant to the user's requested topic.

**List of steps (success scenario)**

1. System: Presents "I want to learn about..." text field
2. User:  Enters "matrices" in text field
3. System: A modal appears where text is generated to explain the requested topic
4. User: Scrolls to read content. Then clicks peripheral of modal to exit.
5. System: Display the generated node in an open space. The node focuses on mouse hover and can be clicked. The node has a button for asking a follow up question. There is a side panel that will list each created tree by the user, as well as a button to create a new tree.

**Extensions/variations of the success scenario**

* The user wants to ask their own follow up question regarding the initial node, and types “how many eigenvectors does a matrix have?”. A new node branches off the original node and they can see the new text as it generates.

**Exceptions: failure conditions and scenarios**

* LLM Generation Timeout or Failure. In this case we will throw an error message, reset the state, and ask the user to try again.
* Connection Lost During Generation. In this case we will throw an error message, reset the state, and ask the user to try again.

### **3.3. Generate a follow-up Node**

**Triggers**

* User clicks button on an existing node for follow-up questions

**Preconditions**

* User has created an account on GPTree
* User has created a Tree with at least one Node

**Postconditions (success scenario)**

* There is now an additional Node on the tree, the node contains information answering the user's question, and it maintains the context of the nodes between it and the root. There are generated potential follow-up questions.

**List of steps (success scenario)**

1. System: A list of 3 potential follow-up questions appear next to the node, as well as an empty text box where user can enter their own question.
2. User: Clicks the first option (E.g. "What is a determinant"?)
3. System: A new node branches off the current node, and a modal appears displaying the question, generated text from LLM, and additional potential follow-up questions.

**Extensions/variations of the success scenario**

* The user wants to ask their own follow up question regarding the initial node, and types “how many eigenvectors does a matrix have?”. A new node branches off the original node and they can see the new text as it generates.
* The user also can click a follow-up question or write their own while in the Node modal. In this case, the modal switches to a new one and the user can see the generated text. When they exit the modal they can see the new Node connected to the previous one.

**Exceptions: failure conditions and scenarios**

* LLM Generation Timeout or Failure. In this case we will throw an error message, reset the state, and ask the user to try again.
* Connection Lost During Generation. In this case we will throw an error message, reset the state, and ask the user to try again.

### **3.4.  View an existing Tree**

**Trigger**

* User clicks on a tree that was previously made

**Preconditions**

* The user has made at least one tree  
* LLM and database accessible

**Postconditions (Success)**

* The tree retains any new nodes added (if any) during review

**List of Steps (Success Scenario)**

1. User selects a tree to review  
2. The data from the tree is fetched from the database  
3. The tree is displayed correctly  
4. The user asks any new questions they have  
5. Nodes are added if needed  
6. The user exits and returns to the menu

**Extensions / Variations**

* “Quick Review” button that will select a flashcard from each node and give them as a list to the user  
* “Review Mode” button that will reduce nodes to brief summaries of the content they contain

**Exceptions (Failure Conditions & Scenarios)**

* The tree was improperly saved or the data was corrupted  
* “Review Mode” inaccurately summarizes the content of a node \-\> display “Manual review recommended” near nodes with a lot of content

### **3.5. View an existing node**

**Triggers**

* 

**Preconditions**

* User has created an account on GPTree
* User has created a Tree with at least one Node

**Postconditions (success scenario)**

* 

**List of steps (success scenario)**

1. 

**Extensions/variations of the success scenario**

* 

**Exceptions: failure conditions and scenarios**

* 

### **3.6. Generate Flashcards from a Node**

**Trigger**

* Learner clicks “Generate Flashcards” on a node or while viewing Node

**Preconditions**

* Target node exists with sufficient content.  
* LLM and database accessible.

**Postconditions (Success)**

* A deck is created/updated with cards (Q\&A, fill-in-the-blanks, pictures, etc.).  
* Cards are inserted into the SRS queue with initial intervals.  
* Practice results update each card’s ease factor and next due date; mastery metrics updated.

**List of Steps (Success Scenario)**

1. Learner selects Generate Flashcards.  
2. System prompts LLM to produce candidate cards following style and difficulty constraints.  
3. Learner optionally edits/removes cards; confirms deck creation.  
4. System persists cards and schedules initial reviews.  
5. Learner opens Practice; cards are presented in due order.  
6. Learner rates recall (Again/Hard/Good/Easy). (This tells how soon to show the card again and tweak the difficulty score.)  
7. The app schedules the next review: farther away if it was easy, sooner if it was hard, and updates your progress.

**Extensions / Variations**

* Whole branch at once: make cards for a subtree (several pages).  
* Export: send cards to CSV(Comma-Separated Values) /Anki (Flashcard app)  
* Auto‑adjust difficulty: if cards are too easy/hard, the app rewrites them to your level.

**Exceptions (Failure Conditions & Scenarios)**

* Too many or too long cards → The app keeps a limit and shortens long ones.  
* Time/clock issues → The server sets the right time so reviews aren’t duplicated or skipped.  
* Can’t save → Your draft list stays on your device, and you’ll see a Try again message.

### **3.7. Generate Flashcards from a Tree**

**Trigger**

* Learner clicks “Generate Flashcards” while viewing Tree

**Preconditions**

* Target node exists with sufficient content.  
* LLM and database accessible.

**Postconditions (Success)**

* A deck is created/updated with cards (Q\&A, fill-in-the-blanks, pictures, etc.).  
* Cards are inserted into the SRS queue with initial intervals.  
* Practice results update each card’s ease factor and next due date; mastery metrics updated.

**List of Steps (Success Scenario)**

1. Learner selects Generate Flashcards.  
2. System prompts LLM to produce candidate cards following style and difficulty constraints.  
3. Learner optionally edits/removes cards; confirms deck creation.  
4. System persists cards and schedules initial reviews.  
5. Learner opens Practice; cards are presented in due order.  
6. Learner rates recall (Again/Hard/Good/Easy). (This tells how soon to show the card again and tweak the difficulty score.)  
7. The app schedules the next review: farther away if it was easy, sooner if it was hard, and updates your progress.

**Extensions / Variations**

* Whole branch at once: make cards for a subtree (several pages).  
* Export: send cards to CSV(Comma-Separated Values) /Anki (Flashcard app)  
* Auto‑adjust difficulty: if cards are too easy/hard, the app rewrites them to your level.

**Exceptions (Failure Conditions & Scenarios)**

* Too many or too long cards → The app keeps a limit and shortens long ones.  
* Time/clock issues → The server sets the right time so reviews aren’t duplicated or skipped.  
* Can’t save → Your draft list stays on your device, and you’ll see a Try again message.


### **3.8.  Use Spaced Repetition Feed**

**Triggers**

The user goes back, looking at all the trees

Reminders given by the website about going back to previous topics 

**Preconditions**

The user has at least one tree and a set of flashcards created for the corresponding tree

The website has saved the user's progress and the tree structure/topics

**Postconditions (success scenario)**

The user goes back to the previous topic tree

The user reviews the flashcards from that tree, recalling information previously given by the LLM

The app updates the progress of review

**List of steps (success scenario)**

1. User selects all flashcards  
2. The website loads the user's previous conversations and current progress in review  
3. User selects “Review previous topics”  
4. The website shows the tree of previously studied topics   
5. The website displays the flashcards from that topic  
6. User flips through the flashcards to review them   
7. The website marks which cards have been reviewed by the user

**Extensions/variations of the success scenario**

The user notes specific “nodes” for later review

User filters flashcards, least reviewed, or those marked by the user

**Exceptions: failure conditions and scenarios**

Website fails to load tree data

Flashcards show the wrong information

## **4\. Non-functional Requirements:**

* **User information is secure:** Any information that the users give us must be kept safe. Passwords and email addresses could be anything from ‘throwaway’ values that the user keeps separate from their important details, or they could match the values used to access their bank account, which means that we have to ensure that nobody can access their data. Even if no personal data is stored during the use of GPTree, we always have to be careful with whatever the user gives us.  
* **Scalable for more users with growth:** For whatever systems we design, we need to ensure that they could be modified to handle a higher amount of traffic as more users interact with GPTree. Regardless of how many users we have, we still need to be able to maintain their personal trees, flashcards, quizzes, etc., so it’s important that we avoid designing around the idea of just serving a few users.  
* **As LLM models advance, making sure that model choice is modular and easy to change / update:** As improvements are made in the technology available to us, it’s important that we design with the future in mind so that GPTree can improve the quality of its generated content and its ability to help users learn.

## **5\. External Requirements:**

* To handle invalid user input, irrelevant or inappropriate inputs from the user will be flagged by an LLM and will prompt users to try again..  
* We will be hosting this webapp on Vercel, which provides free public URL hosting.  
* To ensure that someone else can set up a new server, we will document the build process on the git repository readme. We plan to include a single script that will build the entire project.
* Based on the amount of work required to complete the project, we feel that 5 people will be able to develop this over the course of the quarter. If it turns out that the project takes too much work, then we can scale down the complexity of the features to be more realistic. If it turns out that we have ample time, we plan on developing a mobile IOS app to complement the web page.

## **6\. Team process description:**

### Technical Details
**Frontend:**
The website will be built using Next.js and the React library for a responsive and modular UI. Development will use TypeScript and SCSS for consistent styling and type safety. The app will be hosted on Vercel, allowing quick iteration and automatic deployment from GitHub.

**Backend:**
The server side will be developed using Node.js and Next.js API routes. REST endpoints will support creation and retrieval of Trees, Nodes, Flashcards, and Quizzes.

**LLM Integration:**
GPTree will use the Groq API during development for low-cost access to open-weight models such as gpt-oss-120b. Custom prompt engineering will ensure structured and educational responses. The system will remain modular to allow switching to other LLM providers as needed.

**Data Storage:**
Our database will be hosted as a PostgreSQL database on Prisma. Prisma ORM will manage schemas, relationships, and migrations, ensuring type-safe access and scalable performance.

**Development Environment:**
Development will take place in Visual Studio Code, using GitHub for version control and NPM for package management.

### Team Members
**Brittan: Frontend/Backend**. This team member has experience in the full stack development using [Next.js](http://Next.js) and PostgreSQL. Since GPTree was their idea, they will be helping out on developing and connecting the front and backend, and ensuring general cohesion over the whole project.

**Jungho: Backend**, we need this role to work with AI models and make sure data can be stored nicely into nodes, maintaining correct history per node (a node should contain the context of previous nodes). Is a good fit for the role having worked with OpenAI APIs and is interested in doing more.

**Richman: Frontend and UI/UX**, this is needed for the app to feel approachable and consistent across the different components such as flashcards, quizzes, the trees, etc. Interested in doing frontend and UI, done design in the past for other projects in different classes. 

**Yana: Frontend and UI/UX**. This is important in order to create an attractive website for users and easy to navigate. It is also important for the website to feel satisfying to use and for people to continue to come back to the website. 

**Jackson: Backend**. This role is necessary to work with user data and the database of trees/related content, as well as the LLM’s that will generate the content that users see. He is a good fit for the role primarily because he is highly interested in learning about developing a backend.

### Timeline

##### End Of Week 3 - Requirements & Team Policies
GPTree functional and non-functional requirements are solidified. Team processes are documented.
* UI/UX:  
  - Planning what features are needed and what each part of the website should do and look like  
* Frontend: 
  - Set up structure and basic pages, simple navigation  
* Backend:
  - Get webserver and database online

##### End Of Week 4 - Architecture
System architecture is defined, including data flow, LLM integration, database schema, and API structure. Key UI/UX elements such as Trees, Nodes, Edges, and Flash Cards have prototype designs. 
* UI/UX:  
  - Begin whiteboard process for landing page, tree page, SR learning page, create rough designs/wireframe 
* Frontend: 
  - Define component hierarchy and page layouts.
* Backend:
  - Define Prisma Schema for key entities.

##### End Of Week 5 - Design
Detailed definition of all software components has been completed, including packages, classes, and units of abstraction.  Users can now sign in
* UI/UX:  
  - Design for key components have been completed and are able to be implemented as React components styled with .scss.
* Frontend: 
  - A skeleton model of the tree and nodes have been designed and now are awaiting backend integration.
  - User sign on page and landing page are functional
* Backend:
  - All REST endpoints have been defined for basic entities. This means that the frontend can create DB requests for Trees, Nodes, Users, Flash Cards, etc.
  - Routes for User sign on have been created using nextJS OAuth

##### End Of Week 6 - Testing and Continuous Integration
Users can now Create Trees and generate Nodes. User testing begins (hallway testing, friends, etc)
* UI/UX:
  - Design patterns are created for generic components as needed and exist on a design doc.
  - UX tests are created and documented. Results of testing are documented as well.
* Frontend:
  - Tree and Nodes now support LLM generation using backend. Users can now create trees, create nodes, view trees, and view nodes.
* Backend:
  - Routes have been written connecting to Groq, allowing Frontend to make requests to LLMs. Requests both for a new tree and a follow-up node are defined and are able to maintain the context of the conversation.

##### End Of Week 7 - Implementation and Documentation
Support for Flash Cards is added, and the Spaced Repetition Page is in progress, using a similar framework as the Flash Cards.
* UI/UX:
  -  Design pattern for Flash Cards has been finalized. In addition the design pattern for the spaced repetition page is finalized.
  - UX Testing of Flash Cards is written and begins.
* Frontend:
  - Functionality for Flash Card feature is added. This includes the buttons to generate flash cards and the page to view it.
* Backend:
  - Additional Routes are added for the creation of Flash Cards for both single nodes and trees. Database has been modified to support spaced repetition page and most server request routes are completed.

#### End of Week 8 - Beta Release
Spaced Repetition Page is functional. Thus all functional requirements are at least in beta phase
* UI/UX:
  -  Validate design with UX testing, revise, and fix confusing areas  
  - Testing begins for app as a whole
* Frontend:
  - Display node content with loading/error states, tighten up the basic interactions  
* Backend:
  -  Generate follow up nodes to predict future questions

##### End Of Week 9 - Peer Review
All functional requirements have gone through peer review, feedback is documented and is being addressed

* UI/UX:
  - UX is throughly tested by all developers and by random users (hallway test)
* Frontend:
  - Final exhaustive testing of frontend / polish. Efforts are made to optimize ease of use. Bugs are fixed and quality of life features are implemented.
* Backend:
  - Final exhaustive testing of backend. There are no unexpected REST errors. 

##### End Of Week 10 - Final Release
All Functional Requirements are implemented and tested. A production version is released with a public url.

* UI/UX:
  - UX is throughly tested by all developers and by random users.
* Frontend:
  - Final exhaustive testing of frontend / polish. Efforts are made to optimize ease of use.
* Backend:
  - Final exhaustive testing of backend. There are no unexpected REST errors. 
  - App is moved to production on Vercel.

##### End Of Week 11 - Individual retrospective

Product is released and is ready for presentation. Individual retrospective complete.

### Major risks that may prevent the completion of the project (And Mitigations)

* Groq may fail as a LLM provider and we are unable to find affordable and functional alternatives  
  - We will design our product to be highly modular with regard to both the LLM API provider and the LLM model itself. This will allow us to be able to easily switch both models and providers if ever deemed necessary.
* Team members may not be able to find enough time for development and the project may fail to stay on schedule.  
  - To mitigate this, there will be a constant monitoring of progress to ensure that either the team stays on schedule, or the correct steps are made to either adjust the schedule, expectations for the project, or to increase the productivity of the team.
* Interactive tree or nodes more complex than expected and blocks core features, causing delays to the release. 
   - To mitigate this, we will have the frontend working on a UI/UX skeleton of the nodes for the trees that later can be populated with LLM generated information. We will ensure that the frontend and backend on on the same page regarding the data structure of the trees and nodes, so that the frontend is ready for the API response of the backend.

### Getting External feedback

External feedback will be the most useful the moment we have a functional backend/frontend. Once it is possible to generate a tree at all, it will be important to get user feedback for structural elements as well as potential ideas for features. As features are tweaked and added, we will want even more feedback. We will get this feedback by consulting friends, acquaintances, and random people in hallways. Ideally they can try out the feature with minimal context, so that we can assess the usability of the product.

## **7\. Software Architecture:**

## **8. Software Design:**

## **9\. Coding Guidelines:**