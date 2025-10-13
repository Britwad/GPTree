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

### **3.0. Terminology**
- 

### **3.1. Learn about Eigenvectors**
Written by: Brittan

**Actors**

* User

**Triggers**

* User clicks “New Tree” button

**Preconditions**

* User has created an account on GPT

**Postconditions (success scenario)**

* There are multiple nodes of LLM generated text about Eigenvectors and related topics

**List of steps (success scenario)**

1. User enters “Eigenvectors” in “I want to learn about…” text field  
2. A new node is created and a modal pops up with the text as it generates. Additionally, follow-up questions are generated such as “what is a matrix?”, “what is a determinant”, etc.  
3. The user clicks “what is a determinant” and a new node is created where the user can see the text generated for the follow-up answer.

**Extensions/variations of the success scenario**

* The user wants to memorize the fundamental theory of linear algebra, so they click a button that creates a set of flash cards for review.  
* The user wants to ask their own follow up question regarding the initial node, and types “how many eigenvectors does a matrix have?”. A new node branches off the original node and they can see the new text as it generates.

**Exceptions: failure conditions and scenarios**

* The LLM makes a factual error about Eigenvectors, the user then asks a follow up question that leads to confusing or contradictory information.  
* 

### **3.2. Generate Flashcards from a Node & Practice Using SRS (Richman)**

**Actors**

* Primary: Learner  
* Secondary: LLM Service, SRS Scheduler (Study schedule that shows each flashcard right before you’re likely to forget it), Database

**Trigger**

* Learner clicks “Generate Flashcards” on a node or “Practice” in the hub.

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

### **3.3. Generate Quizzes on Root Nodes (Jungho)**

**Actors**

* Primary: Learner  
* Secondary: LLM Service, Quiz Generator, Database

**Trigger**

* Learner reaches end of branch on a learning path.

**Preconditions**

* Learner finishes a branch.  
* LLM and database accessible.

**Postconditions (Success)**

* A quiz is created/updated  
* Feedback and score is generated upon quiz completion

**List of Steps (Success Scenario)**

1. Learner selects a branch path  
2. Learner finishes branch path  
3. LLM analyzes branch path and generates questions  
4. System formats quiz and displays interactive interface  
5. Learner gets quiz  
6. Learner solves quiz  
7. Learner gets score and feedback  
8. Results are saved optionally

**Extensions / Variations**

* Quiz difficulty can be scaled  
* Option to retry incorrect questions immediately

**Exceptions (Failure Conditions & Scenarios)**

* Branch does not have sufficient content for a quiz  
* LLM fails \-\> could display sample quiz

### **3.4.  Review previously learned content with an old tree (Jackson)**

**Actors**

* Primary: Learner  
* Secondary: LLM Service, Database

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

### **3.5.  Space repetition flashcard review for long-term memory (Yana)**

**Actors**

User

LLM Service, Database

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

Addressing the requirements that the course staff is imposing on GPTree:

* To handle invalid user input, irrelevant or inappropriate inputs from the user will be flagged by an LLM and will prompt users to try again..  
* We will be hosting this webapp on Vercel, which provides free public URL hosting.  
* To ensure that someone else can set up a new server, we will document the build process on the git repository readme.  
* Based on the amount of work required to complete the project, we feel that 5 people will be able to develop this over the course of the quarter. If it turns out that the project takes too much work, then we can scale down the complexity of the features to be more realistic. If it turns out that we have ample time, we plan on developing a mobile IOS app to complement the web page.

## **6\. Team process description:**

We will be using Prisma for our database hosting. This is the best tool for us because it will provide us with a simple online PostGreSQL database, with an ORM as well to keep typing consistent.

We will be using [Next.js](http://Next.js) as our framework, using Vercel to host. This means that we will be developing using the React javascript library.

Because we are using [Next.js](http://Next.js), development will take place using the typescript and SCSS languages. All team members will be developing on the VSCode IDE.

Brittan: Frontend/Backend. This team member has experience in the full stack development using [Next.js](http://Next.js) and PostgreSQL. Since GPTree was their idea, they will be helping out on developing and connecting the front and backend, and ensuring general cohesion over the whole project.

Jungho: Backend, we need this role to work with AI models and make sure data can be stored nicely into nodes, maintaining correct history per node (a node should contain the context of previous nodes). Is a good fit for the role having worked with OpenAI APIs and is interested in doing more.

Richman: He will be frontend and UI/UX designer, this is needed for the app to feel approachable and consistent across the different components such as flashcards, quizzes, the trees, etc. Interested in doing frontend and UI, done design in the past for other projects in different classes. 

Yana: Doing UI/UX design and frontend. This is important in order to create an attractive website for users and easy to navigate. It is also important for the website to feel satisfying to use and for people to continue to come back to the website. 

Jackson: Backend. This role is necessary to work with user data and the database of trees/related content, as well as the LLM’s that will generate the content that users see. He is a good fit for the role primarily because he is highly interested in learning about developing a backend.

Timeline:

End Of Week 3

* UI/UX  Planning what features are needed and what each part of the website should do and look like  
  * Frontend Set up structure and basic pages, simple navigation  
  * Backend Get webserver and database online

  End Of Week 4

  * UI/UX  Begin whiteboard process for landing page, tree page, SR learning page, create rough designs/wireframe  
  * Frontend Start designing functional aspects of landing page   
  * Backend Connect Groq API for general responses and structured outputs.

End Of Week 5

* UI/UX Finalize visual, creating a clickable prototype for user testing.  
  * Frontend Lay out tree/node screens with placeholder content  
  * Backend Finalize prompts, ensure consistent outputs

	End Of Week 6

* UI/UX Validate design with UX testing, revise, and fix confusing areas  
  * Frontend Display node content with loading/error states, tighten up the basic interactions  
  * Backend Generate follow up nodes to predict future questions

	End Of Week 7

* UI/UX Implement UI with the frontend/backend website  
  * Frontend Create practice screen and deck list for flashcards   
  * Backend Connect correct histories together

	End Of Week 8

* UI/UX Implement interactivity and navigation between screens   
  * Frontend Update the deck view and add generate flashcards flow  
  * Backend Generate flashcards

	End Of Week 9

* UI/UX Go back to UX testing with people outside of class, continuing to change any confusing areas to create seamless website  
  * Frontend Add test sections and result summaries  
  * Backend Generate Quizzes

  End Of Week 10

* UI/UX Finalize product, refining any UI inconsistencies, optimize performance  
* Frontend Final exhaustive testing of frontend/ polish.  
* Backend Adapt for mobile app version if we have time  
  End Of Week 11  
* UI/UX: Finish 100% of the design with all cases working without any errors. PRESENT TO CLASS  
* Frontend: Finish 100% of the frontend of the website with all cases working without any errors. PRESENT TO CLASS  
* Backend:Finish 100% of the backend of the website with all cases working without any errors. PRESENT TO CLASS

Specify and explain at least three major risks that could prevent you from completing your project.

* Groq may fail as a LLM provider and we are unable to find affordable and functional alternatives  
* Team members may not be able to find enough time for development and the project may fail to stay on schedule.  
* Interactive tree or nodes more complex than expected and blocks core features, causing delays to the release. 

External feedback

External feedback will be the most useful the moment we have a functional backend/frontend. Once it is possible to generate a tree at all, it will be important to get user feedback for structural elements as well as potential ideas for features. As features are tweaked and added, we will want even more feedback. We will get this feedback by consulting friends, acquaintances, and random people in hallways. Ideally they can try out the feature with minimal context, so that we can assess the usability of the product.
