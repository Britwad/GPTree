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

* User clicks a Node on the Tree view

**Preconditions**

* User has created an account on GPTree
* User has created a Tree with at least one Node
* Target Node exists and the database is accessible

**Postconditions (success scenario)**

* The Node is displayed with Title, Question, Text, Key Points Summary, and generated follow-up questions
* Context is preserved with navigation to parent and child Nodes
* Quick actions are available to ask a follow-up, generate flashcards, copy link, and mark for review
* Reading progress is recorded for the user

**List of steps (success scenario)**

1. System: Receives request to open Node by id
2. System: Fetches Node content and related metadata, including parent and children
3. System: Renders Node view with Title, Question, Text, Key Points Summary, and suggested follow-ups
4. User: Reads content and optionally clicks a suggested follow-up or enters their own question
5. System: Provides navigation to parent and child Nodes and shows quick actions for flashcards and copying a shareable link

**Extensions/variations of the success scenario**

* Open via pop up instead of full page to keep Tree visible
* Keyboard shortcuts for next and previous Node navigation
* Print or export the Node as a PDF or markdown
* Show version history of the Node’s generated content
* Inline search within the Node to highlight keywords

**Exceptions: failure conditions and scenarios**

* Node not found or user lacks permission → Display “Node unavailable” and offer navigation back to the Tree
* Database or network error → Show error message and a Retry option
* Corrupted or incomplete content → Show “Content could not be loaded” with a prompt to regenerate or contact support

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

1. User selects Flashcards button
2. The website loads a new screen where user's previous conversations and current progress in review  
3. User selects “Review previous topics”  
4. The website shows the tree of previously studied topics
5. The User choses which topic to review   
6. The website displays the flashcards from that topic  
7. User flips through each flashcard to review them   
8. The website marks which cards have been reviewed by the user
9. User ends review session by clicking end
10. Website brings user back to homepage

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

### Team Structure
**Brittan: Frontend/Backend**. This team member has experience in the full stack development using [Next.js](http://Next.js) and PostgreSQL. Since GPTree was their idea, they will be helping out on developing and connecting the front and backend, and ensuring general cohesion over the whole project.

**Jungho: Backend**, we need this role to work with AI models and make sure data can be stored nicely into nodes, maintaining correct history per node (a node should contain the context of previous nodes). Is a good fit for the role having worked with OpenAI APIs and is interested in doing more.

**Richman: Frontend and UI/UX**, this is needed for the app to feel approachable and consistent across the different components such as flashcards, quizzes, the trees, etc. Interested in doing frontend and UI, done design in the past for other projects in different classes. 

**Yana: Frontend and UI/UX**. This is important in order to create an attractive website for users and easy to navigate. It is also important for the website to feel satisfying to use and for people to continue to come back to the website. 

**Jackson: Backend**. This role is necessary to work with user data and the database of trees/related content, as well as the LLM’s that will generate the content that users see. He is a good fit for the role primarily because he is highly interested in learning about developing a backend.

### Project Schedule

| **Milestone**                      | **Task**                                                              | **Dependencies**                                                | **Team / Role**            | **Effort (person-weeks)** | **Success Criteria**                          |
| ---------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- | ------------------------: | --------------------------------------------- |
| **Requirements & Setup**           | Define functional and non-functional requirements                     | None                                                            | All                        |                       1.0 | Requirements doc in repo and approved         |
|                                    | Define team policies and set up tools (Discord, GitHub)               | None                                                            | All                        |                       0.5 | Policies in repo; channels and repo active    |
|                                    | Establish environments and hosting (Vercel, PostgreSQL)               | Policies & tools set up                                         | Backend                    |                       1.0 | Web server reachable; DB connection verified  |
|                                    | Plan key pages and user journeys (Landing, Tree, Node, Flashcard, SR) | Requirements defined                                            | UI/UX                      |                       0.8 | User-flow map approved                        |
|                                    | Create low-fidelity wireframes for core pages                         | Page plan complete                                              | UI/UX                      |                       1.0 | Wireframes for Landing/Tree/Node/Flashcard/SR |
| **Architecture Definition**        | Define overall system architecture (frontend–API–LLM–DB)              | Requirements defined                                            | All                        |                       1.0 | Architecture doc approved                     |
|                                    | Define Prisma schema (User, Tree, Node, Flashcard)                    | System architecture defined                                     | Backend                    |                       1.0 | Schema migrated; seed runs                    |
|                                    | Define REST API architecture (REST + LLM endpoints)                   | Prisma schema defined                                           | Backend                    |                       0.8 | Endpoint spec in repo                         |
|                                    | Component hierarchy diagram and folder layout                         | Wireframes complete                                             | Frontend                   |                       0.5 | Component map in repo                         |
| **Design Implementation**          | Implement authentication (Google + email with NextAuth)               | Prisma schema defined; API surface defined                      | Backend                    |                       1.0 | Sign-in/out works; session cookie set         |
|                                    | Build generic UI kit + SCSS structure (buttons, modals, inputs)       | Component hierarchy diagram                                     | Frontend                   |                       1.0 | Reusable components published                 |
|                                    | Design high-fidelity UI for Landing/Tree/Node                         | Wireframes complete                                             | UI/UX                      |                       1.0 | Approved design spec                          |
|                                    | Static pages scaffold (Landing, Tree, Node)                           | UI kit ready; hi-fi design ready                                | Frontend                   |                       1.0 | Pages render; basic navigation works          |
|                                    | Implement REST endpoints (Trees, Nodes, Flashcards)                   | API surface defined; DB live                                    | Backend                    |                       1.0 | REST endpoints pass tests                     |
| **Integration & Use Cases**        | Connect frontend to REST endpoints                                    | REST endpoints implemented; static pages scaffolded             | Frontend + Backend         |                       1.0 | Fetch/create/update flows working             |
|                                    | Integrate Groq for node generation (server)                           | API surface defined; DB live                                    | Backend                    |                       1.0 | Structured JSON output with context           |
|                                    | UC 3.1: User sign in / sign up (UI + flow)                            | Authentication implemented; hi-fi design ready                  | Frontend + UI/UX           |                       0.6 | “Continue with Google/Email” completes        |
|                                    | UC 3.2: Create a Tree (UI + API + LLM)                                | Groq integrated; frontend–REST connected; designed Tree/Node UI | Frontend + Backend + UI/UX |                       1.0 | Root node generated and persisted             |
|                                    | UC 3.3: Generate Follow-up Node                                       | UC 3.2 complete; Groq integrated; designed Node UI              | Frontend + Backend + UI/UX |                       1.0 | Child node created with preserved context     |
|                                    | UC 3.4: View an existing Tree                                         | Frontend–REST connected; designed Tree UI                       | Frontend + UI/UX           |                       0.6 | Tree fetched and rendered; nav ok             |
|                                    | UC 3.5: View an existing Node                                         | UC 3.4 complete; designed Node UI                               | Frontend + UI/UX           |                       0.5 | Node detail modal/page shows content          |
|                                    | Global loading/error states + optimistic UX                           | Frontend–REST connected                                         | Frontend                   |                       0.5 | Graceful errors; spinners; retries            |
|                                    | Initial hallway usability test pass                                   | UC 3.1–3.5 complete                                             | UI/UX                      |                       0.5 | Findings logged; priorities set               |
| **Flashcards & Spaced Repetition** | Flashcard generation routes (node, tree)                              | REST endpoints implemented; Groq integrated                     | Backend                    |                       1.0 | Persisted cards with references               |
|                                    | UC 3.6: Generate Flashcards from a Node (UI)                          | Flashcard routes ready; designed Flashcard UI                   | Frontend + UI/UX           |                       0.8 | Cards visible/editable; saved                 |
|                                    | UC 3.7: Generate Flashcards from a Tree (UI)                          | Node flashcards UI complete; flashcard routes ready             | Frontend + UI/UX           |                       0.8 | Batch generation succeeds                     |
|                                    | Design SR page high-fidelity spec                                     | Wireframes complete                                             | UI/UX                      |                       0.5 | Approved SR design                            |
|                                    | Spaced Repetition scheduling logic (EF/intervals)                     | Flashcards persisted                                            | Backend                    |                       1.0 | Next-due dates computed and updated           |
|                                    | UC 3.8: Spaced Repetition Feed (UI + API)                             | SR logic ready; SR design ready                                 | Frontend + UI/UX + Backend |                       1.0 | Due queue renders and advances                |
| **Beta Completion**                | App-wide polish: loading/errors/progress indicators                   | UC 3.6–3.8 complete                                             | Frontend                   |                       0.5 | Stable interactions across flows              |
|                                    | Whole-app UX validation and revisions                                 | App-wide polish in place                                        | UI/UX                      |                       1.0 | Confusing areas resolved                      |
|                                    | Deploy Beta to Vercel preview                                         | All core use cases complete                                     | Backend                    |                       0.3 | Public preview URL shared                     |
| **Peer Review & Optimization**     | Peer review and triage                                                | Beta deployed                                                   | All                        |                       1.0 | Issues tracked and assigned                   |
|                                    | Frontend performance + accessibility pass                             | Peer review complete                                            | Frontend                   |                       0.8 | No major perf/ARIA issues                     |
|                                    | Backend load/error/security tests                                     | Peer review complete                                            | Backend                    |                       0.8 | No REST/LLM errors under normal load          |
| **Final Release & Documentation**  | Full end-to-end QA of use cases                                       | Peer fixes complete                                             | All                        |                       1.0 | All UC 3.1–3.8 verified                       |
|                                    | Production deployment to Vercel                                       | QA complete                                                     | Backend                    |                       0.3 | Stable production URL live                    |
|                                    | Final docs and presentation                                           | Production live                                                 | All                        |                       1.0 | Report and slides in repo                     |
| **Retrospective**                  | Individual + team retrospectives                                      | Final release complete                                          | All                        |                       0.5 | Retros posted; action items captured          |

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

### Risk assessment

* Groq may fail as a LLM provider and we are unable to find affordable and functional alternatives  
  - Low liklihood of occuring
  - High impact if it occurs
  - The liklihood of it occuring is low because Groq is known for being reliable due to its 
    performance-focused approach The impact is high because if the Groq fails as an LLM provider, 
    it could lead to loss of functionality in the website. We as the team would need to refactor 
    large portions of code and lead to not finishing the project on time. 
  - Steps you are taking to reduce the likelihood or impact, and steps to permit better estimates;
  - To reduce the likihood or impact, the team will arefully read API docs to not use any depricated features
  - To detect if Groq has failed on us, we will look for any thrown API error responses
  - Should this occur, we would look into what error is being thrown, find where the issue is and debug. We will 
    design our product to be highly modular with regard to both the LLM API provider and  the LLM model itself. 
    This will allow us to be able to easily switch both models and providers if ever deemed necessary.
* Team members may not be able to find enough time for development and the project may fail to stay on schedule.  
  - Medium liklihood of occuring
  - Meduim impact if it occurs
  - It can be hard to estimate how long a task will take us, especially since we are students and are still learning the pacing
    of larger projects. It is not rare for a team to find they don't have as much time as they hoped, so although it could be hard,
    there are many different tatics we can use to overcome this. 
  - Steps we are taking in order to avoid this from happening are, looking over the schedule, asking the team where they are at and
    what they are currently working on so everyone is able to be on track.
  - To detect the problem, we look back at our planned out schedule, making sure we are all on track
  - To mitigate this, there will be a constant monitoring of progress to ensure that either the team stays on schedule, 
    or the correct steps are made to either adjust the schedule, expectations for the project, or to increase the productivity of 
    the team. Additionally, roles in the team will shift in order to help whichever side of the project needs more help.
* Interactive tree or nodes more complex than expected and blocks core features, causing delays to the release. 
  - Low liklihood
  - Low impact to occur
  - Since we are planning to start out really simple and work our way up to a more complex trees/nodes, we plan to solidify before
    adding a layer of complexities, so the liklihood should be low. If it was to happen, we would backtrack to our latest design that
    worked
  - As previously said, in order to avoid complications with complex tree and node features, we plan to begin with simple implementations,
    adding layers of complexity once the prevoius layer is solid. We check that a "layer of complexity" is solid with testing. 
  - To detect this problem we will interact with the website ourselves and use tests to find any issues
  - To mitigate this, we will have the frontend working on a UI/UX skeleton of the nodes for the trees that later can be 
   populated with LLM generated information. We will ensure that the frontend and backend on on the same page regarding the data structure of the trees and nodes, so that the frontend is ready for the API response of the backend.
* May focus too much on the stretch goals, before solidifying the necessary features for the site.
  - Low liklihood
  - Meduim impact
  - At the very beginning of our project planning we chose what our strech goals are, and as long as people stick to the plan, the liklihood
    it happening are very low. If we do begin to focus to much on the strech goals, we may lose time that should have been used for the 
    must haves of the project, setting us back.
  - The steps to avoid this problem are, we plan to communicate what we are working on, double checking that it aligns with the schedule.
  - We would detect this issue by looking at how much we have completed for the project, and deciding as a team which stretch goals would
    serve us best for whatever time we may have left before the deadline
  - To mitigate this, we plan to continue to remind each other of what are the needs and wants of the project and what should be completed
    for that week
* Overuse or spikes in traffic could exceed limits, causing service interuptions
  - Medium liklihood
  - High impact
  - The likihood of it happening are meduim because rate limits are common during testing and 
    scaling phases. The impact is high because if it is triggered, the functionality of the 
    website relying on the LLM could slow or completely stop.
  - To reduce the likilihood or impact, we could add caching for repeated queries to lessen API
    calls
  - To detect the problem we would monitor the API status code error indicating too many requests
     in a short period.

### Test plan & bugs

#### Unit Tests

Unit tests will verify that the smallest functional parts of the system behave as expected. Since our backend follows a REST architecture, we will write Jest tests for each REST endpoint covering typical, boundary, and failure cases. This includes:

- User routes: authentication, sessions, and access control.
- Tree routes: creation, retrieval, and updates of user trees.
- Node routes: generation of nodes, retrieval of nodes
- Flashcard routes: generation of flashcards, retrieval of nodes, and spaced-repetition scheduling logic.

Mock data will be used for database calls (via Prisma mock client) and for LLM responses, so that tests remain fast and deterministic. Each test will check both the returned JSON structure and the database side effects, ensuring schema alignment. We consider our unit test suite sufficient when it covers all REST endpoints and their common error cases.


#### Usability Testing

Usability testing will take place once the main user flows are implemented. Our approach will be “hallway testing”: informal but structured sessions where participants use GPTree with minimal explanation while we observe where confusion or friction occurs.
Each round of usability testing will have specific goals (e.g., “Can users find how to generate a follow-up node?” or “Do users understand how to review flashcards?”). Results will be summarized and prioritized into GitHub Issues, guiding the next design or UX iteration.

#### Bug Tracking

All bugs and feature regressions will be tracked using GitHub Issues. Each issue will include:

- Clear description of the problem and steps to reproduce

- Screenshots or stack traces where applicable

- Labels indicating severity, area (frontend/backend/UI), and milestone

- Assignment to responsible team members

Issues discovered through testing will be linked to specific commits or pull requests for traceability. Resolved issues will be verified in the next test cycle before closing.

### Documentation plan

* We will document every software component and API endpoints in our Software Design section of this document
  - This will include making sure to note how components relate to each other. And documenting our React Component Hierarchy.
  - There will be documentation for each REST endpoint in a .md file in git. In this file we plan to cover API request parameters, and expected response.
* For users documentation, we will have a help/FAQ page if they are to get stuck at any point while using the site
  - In support of this, we plan to implement either a "learn more" hyperlink or question mark button that will link the user to relevant guide pages if they need further explanation of using tools. Although we also plan on ensuring that GPTree is as intuitive as possible for users.

### Getting External feedback

External feedback will be the most useful the moment we have a functional backend/frontend. Once it is possible to generate a tree at all, it will be important to get user feedback for structural elements as well as potential ideas for features. As features are tweaked and added, we will want even more feedback. We will get this feedback by consulting friends, acquaintances, and random people in hallways. Ideally they can try out the feature with minimal context, so that we can assess the usability of the product.



## **7. Software Architecture**

### 7.1 Overview of System Architecture

The components of our app that power the backend provide two main functionalities: first, we have a database, Prisma, that will allow us to store all of the ‘things’ that a user will be able to access through GPTree, and second, Groq, the LLM that will actually allow us to generate responses to the questions a user asks. For the frontend, we have a React app that will allow the client to see their trees and interact with our program. We are also using **NextAuth.js** to manage user authentication through both **Google sign-in** and **magic link** login methods.

To provide an interface between our frontend app and the tools in our backend (Prisma, Groq), we have an API layer that will allow the frontend code to ‘talk’ to the backend. We don’t want the client side code to directly interact with our database (which is already impossible with Prisma) or Groq for security reasons, control reasons, authorization reasons, etc. so we have ‘REST endpoints’ that our frontend will call. We can
use the standard HTTP/HTTPS ‘fetchʼ to access these endpoints, which will then use server side code to call the appropriate tool’s API. Our frontend will receive JSON responses from these calls, and then parse them appropriately.

We plan to **deploy GPTree on Vercel**, which provides built-in support for Next.js serverless functions and easy integration with Prisma. This allows for efficient deployment, continuous integration, and scaling with minimal configuration.

### 7.2 Detailed View of System Architecture

First, we will specify the way our fronend and backend communicate. We can call our endpoints with `fetch`, which allows us to provide information through the url or through the request body. When dealing with a request body, we use the NextRequest object's .json() method to convert the request into JSON, and the ZodObject .parse() method to convert this JSON into the appropriate record, which gives us the ability to catch an error if the request is not properly formatted. In general, we have our own schemas defined for every inetraction our frontend and backend have (for example, the schema that the frontend must satisfy to create a new user, plus the schema of what it will get back), and all of these are handled with Zod. Note that the validation_schemas.ts file contains any and all schemas we send/recieve or otherwise need to parse.

We will move from the 'farthest' parts of the backend (I.E. Prisma and Groq) to the 'closest' (I.E. the app that the client interacts with).

- Prisma
  - Includes its own methods for us to call in our backend: `create()`, `findMany()`, `deleteMany()`, etc.
  - After parsing a request to ensure it contains the information prisma requires to add/delete/alter entries in tables (e.g. CreateUserSchema in validation_schemas.ts), the route will call the appropriate prisma method, and then handle the returned information as needed
  - Depending on the operation, the backend route will send a different JSON object back to the client, for example, when a user is created, this JSON contains a record matching the `User` type in validation_schemas.t
- Groq
  - Includes its own methods for us to call in our backend: `create()`, `createInterface()`, etc.
  - Just like with Prisma, the backend will parse a request via Zod, then call the appropriate method from the Groq API
  - Groq, however, will also access our database in order to get access to the text associated with nodes that give the LLM the context it needs to generate good responses, and this will occur with the same prisma methods that the other routes use
  - Once the route gets what it needs from Groq, it will complete any remaining operations and return a JSON object to the client containing the response and any other data we choose to include
- API Layer
  - Consists of a file structure that Next.js uses for handling route navigation/resolution, where 'route.ts' files exist at all endpoints that our backend provides
  - The client can request, alter, or upload information to our database via `GET` and `POST` methods implemented in these files
  - Routes generally accept a NextRequest object, and somtimes other paramters, and return a JSON object via NextResponse.json() to the client
  - Routes in the backend are the only area where we actually reach out to our external tool API's (Prisma and Groq)
- Frontend
  - Navigation between different frontend pages occurs via the Next.js router, and backend interaction occurs via `fetch` methods.
  - The frontend will handle any and all HTML for the webpage, but will utilize the JSON it recieves from the backend 
  - When calling backend endpoints, the frontend will use the information stored in its own state to provide the information these routes require, and if it isn't able to, it will change its behavior (i.e. the HTML it's displaying) depending on the status codes it recieves from the server

### 7.3 Data Storage and Schema

In general, there are four ‘things’ we need to store: **User information**, **Trees**, **Nodes**, and **Flashcards**. Prisma gives us a convenient abstraction about our relational database, as we can store actual objects and collections of objects inside of it. Prisma handles the conversion of this object abstraction into a form that actually matches the RDB abstraction, so we just have to think about objects. Our top-level schema is represented below in simplified database tables.

The first four models — User, Account, Session, and VerificationToken — are required by NextAuth.js to manage authentication and user sessions. They securely store user identities, linked login providers, active sessions, and verification tokens, forming the foundation that all GPTree data depends on.

---

#### **User**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | String | **PK** | Unique identifier for each user (auto-generated cuid). |
| name | String? | — | Full name of the user (optional). |
| email | String? | **UQ** | User's email address (used for login). |
| emailVerified | DateTime? | — | Timestamp of email verification. |
| createdAt | DateTime | — | When the user account was created. |
| image | String? | — | Profile picture URL. |
| accounts | Account[] | — | All authentication provider accounts linked to this user. |
| sessions | Session[] | — | All active sessions for this user. |
| trees | Tree[] | — | All trees created by this user. |

---

#### **Account**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | String | **PK** | Unique identifier for each account record. |
| userId | String | **FK → User(id)** | References the user who owns this account. |
| type | String | — | Type of authentication (e.g., "oauth", "email"). |
| provider | String | — | Name of the authentication provider (e.g., "google", "auth0"). |
| providerAccountId | String | **UQ (per provider)** | Unique account ID assigned by the provider. |
| refresh_token | String? | — | OAuth refresh token, if provided. |
| access_token | String? | — | OAuth access token. |
| expires_at | Int? | — | Expiration timestamp for the token. |
| token_type | String? | — | Type of access token (e.g., "Bearer"). |
| scope | String? | — | OAuth scopes granted by the provider. |
| id_token | String? | — | ID token returned by the provider. |
| session_state | String? | — | Additional session state data. |
| user | User | — | Relation to **User** (many-to-one). |

---

#### **Session**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | String | **PK** | Unique identifier for the session record. |
| sessionToken | String | **UQ** | Token identifying the user session. |
| userId | String | **FK → User(id)** | Links the session to its associated user. |
| expires | DateTime | — | Timestamp of session expiration. |
| user | User | — | Relation to **User** (many-to-one). |

---

#### **VerificationToken**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| identifier | String | — | The email or identifier of the user. |
| token | String | **UQ** | Token used for magic link or email verification. |
| expires | DateTime | — | Timestamp when this token becomes invalid. |
| *(no relations)* | — | — | Standalone table used for login verification. |

---

#### **Tree**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | Int | **PK** | Unique identifier for each learning tree. |
| name | String | — | Name or title of the tree. |
| userId | String | **FK → User(id)** | References the user who owns the tree. |
| createdAt | DateTime | — | When the tree was created. |
| updatedAt | DateTime | — | Automatically updates whenever the tree changes. |
| user | User | — | Relation to **User** (many-to-one). |
| node | Node[] | — | Relation to **Node** (one-to-many). |

---

#### **Node**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | Int | **PK** | Unique identifier for each node. |
| name | String | — | Short name or title for the node. |
| question | String | — | The question or topic that the node represents. |
| content | String | — | The generated explanation or main content of the node. |
| followups | String[] | — | List of suggested follow-up questions. |
| treeId | Int | **FK → Tree(id)** | Links the node to its parent tree. |
| tree | Tree | — | Relation to **Tree** (many-to-one). |
| parentId | Int? | **FK → Node(id)** | Optional reference to the parent node (if this node is a child). |
| parent | Node? | — | Relation to the parent **Node** (many-to-one). |
| children | Node[] | — | Relation to all child **Nodes** (one-to-many self-relation). |
| flashcards | Flashcard[] | — | Relation to **Flashcard** (one-to-many). |

---

#### **Flashcard**

| **Field Name** | **Type** | **Key** | **Description** |
|----------------|-----------|----------|-----------------|
| id | Int | **PK** | Unique identifier for each flashcard. |
| name | String | — | Title or keyword label for the flashcard. |
| content | String | — | The question-and-answer text content of the flashcard. |
| nodeId | Int | **FK → Node(id)** | References the node that this flashcard belongs to. |
| node | Node | — | Relation to **Node** (many-to-one). |



### 7.4 Assumptions

One large assumption we’re making is that the responses we get from Groq will be generally acceptable to the user. There’s a limit to what we can do to prevent or handle hallucinations, especially with more complex topics that we might not account for during development. While this is a risk we would have to mitigate with any LLM, it’s a general assumption that the majority of what the user gets back will be of good quality. If, for whatever reason, the LLM we have spits out incorrect, misleading, or confusing information, it would compromise the quality of GPTree, meaning we need to be especially cautious when working with the LLM component of our system (as in choosing what context we give it, how user questions convert to prompts, etc.).

### 7.5 Decisions and Alternatives
One decision we made is to use Next.js as our framework, but we could have chosen something else like Remix. Next.js has a more traditional separation between client side code and server side code, while Remix has files that contain both. A big pro for Next.js is that our team members are familiar with this framework, either from personal projects or work done in another CSE class at UW, which means we can spend less time learning how it works. Remix is entirely different, and its learning curve can be steep, which could end up being costly to our schedule. That said, Next.js isn’t perfect, and after getting over the initial learning curve for Remix, it’s possible that the streamlined methods to make API calls (loader and action methods in Remix) would be easier to write/implement than much of the tedious work to write, handle, and parse fetch methods. We still think that our familiarity with Next.js, as well as its frequent use (and already optimized integration) with other parts of our stack like Prisma and Vercel offers enough of an advantage to choose it over Remix.

Another decision was to use Prisma instead of another ORM (object relational mapper, I.E. the abstraction between a normal RDB and one with objects) such as Drizzle. Our choice to use Next.js as our framework is crucial in choosing an ORM, as different options have different levels of compatibility with our chosen framework. In this case, Prisma has Next.js guides in its official documentation, and very deep integration with Next.js, meaning that, not only is using Prisma in our project easier, but troubleshooting will also be easier because of the larger amount of tutorials, guides, and support that other developers have created. Drizzle does offer its own advantages though, most notably, its similarity to traditional SQL. Writing a query in Drizzle is slightly more explicit than in Prisma, and as a result, slightly more intuitive. This means that we could spend less time trying to learn new methods and query techniques, and rely on prior knowledge about SQL. Considering the time we’ve ‘saved’ by choosing Next.js, however, it’s reasonable to allocate some extra time to familiarize ourselves with Prisma, as its integration with Next.js will most likely make our lives much easier when working with our database farther down the line.

## **8. Software Design:**

### 8.1 Frontend — React (Next.js)
**Responsibilities:**  
- Display learning trees, nodes, and flashcards.  
- Handle interactions (follow-ups, generate flashcards, study).  
- Call backend REST endpoints and manage basic client state.

**Formation:**  
- Built with **Next.js** (routing/SSR) and **React** components.  
- Organized into pages (Tree view, Study) and reusable components (Node, Flashcard).  
- Uses fetch over HTTPS for API calls.  
- Deployed on **Vercel** alongside the backend.

---

### 8.2 Authentication — NextAuth.js
**Responsibilities:**  
- Authentication and session management.  
- Google sign-in and magic link email login.  
- Provide secure user identity to frontend and backend.

**Formation:**  
- Implemented with **NextAuth.js** as an API route.  
- Cookie-based sessions accessible server-side and client-side.

---

### 8.3 API Layer — REST Endpoints
**Responsibilities:**  
- Interface between frontend and backend services.  
- Expose endpoints for Trees, Nodes, Flashcards, and Study (SRS).  
- Enforce authentication and authorization.

**Formation:**  
- **Next.js API routes** returning and accepting JSON.  
- Internally calls **Prisma** (database) and **Groq** (LLM) as needed.

---

### 8.4 Database — Prisma (PostgreSQL)
**Responsibilities:**  
- Persist Users, Trees, Nodes, and Flashcards.  
- Maintain data integrity and relationships (e.g., Node belongs to Tree).  
- Support create, read, and update operations for learning structures.

**Formation:**  
- **Prisma ORM** over **PostgreSQL**.  
- Models defined in a Prisma schema generate a type-safe client used in API routes.  
- All database access is server-side only.

---

### 8.5 LLM Integration — Groq API
**Responsibilities:**  
- Generate node content and flashcards from user prompts.  
- Provide suggested follow-up questions and structured learning output.  
- Act as the content generation layer.

**Formation:**  
- Backend calls the **Groq API** from routes or services.  
- Prompts include the user’s question and context; outputs are parsed and validated server-side.  
- Timeouts and errors are handled gracefully for a stable UI.

---

### 8.6 Deployment — Vercel
**Responsibilities:**  
- Host the frontend and serverless API.  
- Provide continuous deployment and scaling.  
- Manage environment configuration.

**Formation:**  
- **Vercel** deploys the Next.js app; API routes run as serverless functions.  
- **Prisma** connects to the hosted PostgreSQL database at runtime.  
- Preview deployments are used for feature branches.


## **9. Coding Guidelines:**
We will follow established, public style guides and enforce them with automated tooling and review.

TypeScript

Guide: [https://ts.dev/style/#visibility]

We chose this because it is clear and practical. It explains naming, imports, visibility, and API design so our code stays consistent and easy to review.
Enforcement: ESLint with TypeScript rules and Prettier for auto formatting. Continuous integration runs lint and format checks on every pull request. Precommit hooks run the same checks before a commit. Code reviews use a short style checklist.

CSS

Guide: [https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/CSS]

We chose this because it follows web standards and stresses readability and accessibility, which keeps styles simple and maintainable.
Enforcement: Stylelint with the standard config and Prettier for formatting. Continuous integration runs style checks on every pull request. Precommit hooks check changed files. Reviewers confirm selector names, file structure, and comments follow the MDN guidance.

## **Developer Documentation**

Clone `git@github.com:Britwad/GPTree.git` or `https://github.com/Britwad/GPTree.git` and change into the project directory. Run `npm install` to fetch dependencies. Copy `.env.example` to `.env` and fill the values for Google auth, the database URL, and the Groq key. You can use a local PostgreSQL instance or start one with Docker compose. There are no submodules.

The `app` folder holds the Next.js application and the API route handlers under `app/api`. The `components` folder contains reusable React components. The `lib` folder contains helpers such as the Prisma client and auth utilities. The `prisma` folder contains the Prisma schema, migrations, and the seed script. The `test` folder contains Jest tests. The `types` folder holds shared TypeScript types. The `public` folder serves static assets. Repository documents such as the living document and coding guidelines live at the root along with configuration files like `jest.config.js`, `next.config.ts`, and `tsconfig.json`.

Ensure a PostgreSQL database is reachable and that `DATABASE_URL` is set in `.env`. Generate the Prisma client with `npx prisma generate` and apply migrations with `npx prisma migrate dev` for development or `npx prisma migrate deploy` for production. Build the application with `npm run build` and start it with `npm start`. During development you can run `npm run dev` to launch the local server at `http://localhost:3000`.

Run `npm test` to execute the Jest test suite. No extra setup is required after `npm install`. Tests run against the application code and use mocks for external services. If you need integration tests with a database, point `DATABASE_URL` to a dedicated test database. Use `npm run test:watch` for watch mode and `npm run test:cov` for coverage when those scripts are present in `package.json`.

Add tests in the `test` folder and name each file after what it covers with a `.test.ts` suffix, for example `user_routes.test.ts`. Group related tests with a `describe` block whose string clearly names the subject, such as `testing tree route` or `tree routes`. Each behavior should be checked in a separate `it` block that reads like a sentence, for example `adds a tree to the database`. Use `beforeAll`, `afterAll`, and `beforeEach` for setup and cleanup, such as resetting or seeding the database. Assertions use Jest’s `expect` API to compare actual results with expected results. Keep tests deterministic by mocking external services like the LLM adapter and any network requests. For route tests, Supertest can be used once a lightweight test server helper is added to the repo.

We are a webapp and the analogous release artifact is a Vercel production deployment of the Next.js build.
