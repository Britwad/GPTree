# **GPTree User Manual**

## **1. Overview**
GPTree is a web-based learning platform that helps users explore and understand any topic using
AI-powered learning trees.
Each topic begins with a single "root" node, than can branch into follow-up/deeper subtopics.

GPTree turns AI conversations into structured, navigable learning tees. Each node can automatically
generate flashcards for review of topics/nodes, and users can revisit them later using spaced
repetition for better long-term memory.

### **WHY USE GPTree?**
    - Build a personal knowledge tree for any subject, with cleearly connected ideas
    - Ask questions natuallu and see how different concepts relate
    - Turn any learning session into flashcards and review then efficiently
    - Organize your learning, no longer getting unstructered notes


## **2. Running GPTree**
a. Open browser with http://localhost:3000 
b. Either sign in with you email or continue with Google


## **3. Using GPTree**
a. Create an account 
    Add your email into the text box or signing in with Google
    Once logged in, you'll see your dashboard listing all of your trees

b. Create a Tree
    Click "New Tree"
    Enter a topic into the prompt box
    GPTree will generate a root node explaining the topic
    The Tree will display the root node which you could click to go back to if at any time you
    Create a child node

c. Creating new nodes
    Click any node in your tree to open it
    There you will see the original question and response, key points, and suggested follow-up
    questions
    Click a follow-up to create a new node branching off the current node, or manually click new
    Node to go into a sub topic

d. Review and Navigate trees
    Use the Tree view page to see your learning structure
    Click any node to read its contents or add new questions
    Use the side panel to switch between different trees

e. Generate Flashcards
    In any node, click "Generate Flashcards"
    GPTree will automatically create cards based off the current tree nodes contents
    With the cards you can edit or delete them and save them to a deck tied with the current tree

f. Using Spaced Repetition
    Go to "Review Mode" or "Spaced Repetition" in the side branch
    GPTree will show flashcards of all the trees you have created
    You can manually click multiple trees in order to focus on only a subset of all created trees 
    Rate your recall as "hard", "good", or "easy", where the app will adjust based off of these


How to report a bug. This should include not just the mechanics (a pointer to your issue tracker), but also 
what information is needed. You can set up a bug-report template in your issue tracker, or you can reference a 
resource about how to write a good bug report. Here is an example for bug reporting guidelines.

## 4. Reporting bugs**
If you run into an issue, report it in the Issue Tracker https://github.com/Britwad/GPTree/Issues

Filing a good Bug Report:

### **4.1. Describe the problem**
    What you expected to happen?
    What actually happened?

### 4.2. Include reproduction steps**
    What steps you took leading up to the issue?

### **4.3. Attach relevent details**
    Screenshots (User Interfact bug)
    Error messages or console logs
    
## **5. Current limitations**
    Flashcard generation may occationally repeat or omit key concepts
    Tree visualization may slow for very large trees
    No mobile app yet-desktop only (mobile veiw in progress)