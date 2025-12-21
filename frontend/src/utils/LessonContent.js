// frontend/src/utils/LessonContent.js
// This holds the detailed content for your lessons

export const getLessonContent = (lesson) => {
    // Ensure lesson object is valid and has an ID
    if (!lesson || !lesson.id) {
        return {
            sections: [
                {
                    type: 'introduction',
                    title: 'Lesson Content Unavailable',
                    content: `
                        <h3>Lesson details are missing.</h3>
                        <p>Please select a valid lesson. If the problem persists, contact support.</p>
                    `
                }
            ]
        };
    }

    const contentDatabase = {
        // --- Mathematics - Class 8 ---
        'math_rational_numbers': { // ENHANCED LESSON
            sections: [
                { type: 'introduction', title: 'Welcome to Rational Numbers!', content: `
                    <h3>A Journey Through Numbers</h3>
                    <p>You've already explored the fascinating world of numbers: natural numbers, whole numbers, and integers.</p>
                    <p>Today, we're taking another exciting step to discover a new family of numbers: <strong>Rational Numbers</strong>! They are everywhere, from dividing a pizza to understanding fractions in science.</p>
                    <div class="visual-example">
                        <img src="https://via.placeholder.com/400x200?text=Number+Line+Intro" alt="Number line introduction" style="max-width:100%;">
                        <p>Numbers help us describe the world around us.</p>
                    </div>
                    <p>Let's dive in and see how rational numbers simplify many mathematical problems and real-life situations.</p>` 
                },
                { type: 'lesson', title: 'Recap: Types of Numbers', content: `
                    <h3>Numbers You Already Know</h3>
                    <ul>
                        <li><strong>Natural Numbers (N):</strong> Counting numbers {1, 2, 3, ...}. Think of apples on a tree.</li>
                        <li><strong>Whole Numbers (W):</strong> Natural numbers including zero {0, 1, 2, 3, ...}. Zero means no apples.</li>
                        <li><strong>Integers (Z):</strong> Whole numbers and their negatives {..., -2, -1, 0, 1, 2, ...}. Useful for temperature below zero or debt.</li>
                    </ul>
                    <p>But what if you have half an apple? Or 3/4 of a pizza? That's where rational numbers come in!</p>`
                },
                { type: 'practice', title: 'Quick Check: Number Types', questions: [
                    {
                        id: 'rational_q1_recap',
                        questionText: 'Which set of numbers includes -5?',
                        options: [
                            { text: 'Natural Numbers', isCorrect: false },
                            { text: 'Whole Numbers', isCorrect: false },
                            { text: 'Integers', isCorrect: true }
                        ]
                    },
                    {
                        id: 'rational_q2_recap',
                        questionText: 'What is the smallest Natural Number?',
                        options: [
                            { text: '0', isCorrect: false },
                            { text: '1', isCorrect: true },
                            { text: '-1', isCorrect: false }
                        ]
                    }
                ]},
                { type: 'lesson', title: 'Defining Rational Numbers', content: `
                    <h3>The Big Definition!</h3>
                    <p>A number that can be expressed in the form <strong>p/q</strong>, where p and q are integers and q ≠ 0, is called a <strong>Rational Number</strong>.</p>
                    <div class="example-box">
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>1/2 (p=1, q=2)</li>
                            <li>-3/4 (p=-3, q=4)</li>
                            <li>5 (can be written as 5/1, so p=5, q=1)</li>
                            <li>0 (can be written as 0/1, so p=0, q=1)</li>
                        </ul>
                        <p>Remember, the denominator (q) can NEVER be zero!</p>
                    </div>
                    <p>All natural numbers, whole numbers, and integers are also rational numbers!</p>`
                },
                { type: 'practice', title: 'Identifying Rational Numbers', questions: [
                    {
                        id: 'rational_q3_identify',
                        questionText: 'Is 3/0 a rational number?',
                        options: [
                            { text: 'Yes', isCorrect: false },
                            { text: 'No', isCorrect: true }
                        ]
                    },
                    {
                        id: 'rational_q4_identify',
                        questionText: 'Which of the following is NOT a rational number?',
                        options: [
                            { text: '0.5 (as 1/2)', isCorrect: false },
                            { text: '√2', isCorrect: true }, // This is irrational
                            { text: '-7 (as -7/1)', isCorrect: false }
                        ]
                    }
                ]},
                { type: 'lesson', title: 'Properties of Rational Numbers', content: `
                    <h3>How do they behave?</h3>
                    <p>Rational numbers share some important properties under different operations:</p>
                    <ul>
                        <li><strong>Closure:</strong> They are closed under addition, subtraction, and multiplication. This means if you add, subtract, or multiply two rational numbers, the result is always a rational number.</li>
                        <li><strong>Commutativity:</strong> Order doesn't matter for addition (a+b = b+a) and multiplication (a×b = b×a).</li>
                        <li><strong>Associativity:</strong> Grouping doesn't matter for addition ((a+b)+c = a+(b+c)) and multiplication ((a×b)×c = a×(b×c)).</li>
                        <li><strong>Distributivity:</strong> a×(b+c) = a×b + a×c</li>
                        <li><strong>Additive Identity (0):</strong> a + 0 = a</li>
                        <li><strong>Multiplicative Identity (1):</strong> a × 1 = a</li>
                    </ul>`
                },
                { type: 'practice', title: 'Properties in Action', questions: [
                    {
                        id: 'rational_q5_properties',
                        questionText: 'Is the set of rational numbers closed under division?',
                        options: [
                            { text: 'Yes', isCorrect: false },
                            { text: 'No', isCorrect: true }
                        ]
                    },
                    {
                        id: 'rational_q6_properties',
                        questionText: 'What is the additive inverse of 3/5?',
                        options: [
                            { text: '5/3', isCorrect: false },
                            { text: '-3/5', isCorrect: true },
                            { text: '0', isCorrect: false }
                        ]
                    }
                ]},
                { type: 'lesson', title: 'Representation on the Number Line', content: `
                    <h3>Visualizing Rational Numbers</h3>
                    <p>Just like integers, rational numbers can be represented on a number line. Between any two rational numbers, there are infinitely many other rational numbers!</p>
                    <div class="visual-example">
                        <img src="https://via.placeholder.com/400x150?text=Rational+Number+Line" alt="Rational numbers on a number line" style="max-width:100%;">
                        <p>To represent 1/2, divide the segment between 0 and 1 into two equal parts.</p>
                        <p>To represent -3/4, divide the segment between 0 and -1 into four equal parts and count three from 0 towards -1.</p>
                    </div>`
                },
                { type: 'summary', title: 'Summary: Rational Numbers', content: `
                    <p>Rational numbers are a fundamental expansion of our number system, allowing us to represent parts of a whole and more complex relationships. They possess key properties that make them easy to work with in various mathematical operations. Understanding their definition, properties, and representation on the number line is essential for advanced mathematics.</p>
                    <p>Keep practicing to master these concepts!</p>
                    ` // REMOVED BUTTONS HERE, LessonViewer will render them
                }
            ]
        },
        // --- Other Math Lessons (unchanged for now) ---
        'math_linear_equations': {
            sections: [
                { type: 'introduction', title: 'What are Linear Equations?', content: `
                    <h3>Equations with One Unknown</h3>
                    <p>You've seen expressions like <strong>x + 5</strong>. When we set an expression equal to a value, it becomes an equation!</p>
                    <div class="example-box">
                        <p>A <strong>linear equation in one variable</strong> is an equation that can be written in the form <strong>ax + b = 0</strong>, where a and b are real numbers and a ≠ 0.</p>
                        <p>Example: <strong>2x + 3 = 7</strong></p>
                        <p>Here, 'x' is the variable, and its highest power is 1 (linear).</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Solving Linear Equations', content: `
                    <h3>Balance the Equation!</h3>
                    <p>The goal is to find the value of the variable. We do this by performing the same operation on both sides of the equation to keep it balanced.</p>
                    <div class="example-box">
                        <h4>Solve: x + 5 = 12</h4>
                        <p>1. Subtract 5 from both sides: x + 5 - 5 = 12 - 5</p>
                        <p>2. Result: <strong>x = 7</strong></p>
                        <p>Check: 7 + 5 = 12 (Correct!)</p>
                    </div>` 
                },
                {   // MODIFIED: Practice section now returns an array of question objects
                    type: 'practice', 
                    title: 'Practice Solving Equations', 
                    questions: [
                        {
                            id: 'math2_q1',
                            questionText: 'Solve: 3x = 15',
                            options: [
                                { text: '3', isCorrect: false },
                                { text: '5', isCorrect: true },
                                { text: '10', isCorrect: false }
                            ]
                        },
                        {
                            id: 'math2_q2',
                            questionText: 'Solve: y - 8 = 2',
                            options: [
                                { text: '6', isCorrect: false },
                                { text: '10', isCorrect: true },
                                { text: '-6', isCorrect: false }
                            ]
                        }
                    ]
                },
                { type: 'summary', title: 'Summary: Linear Equations', content: `
                    <p>Linear equations are powerful tools for solving real-world problems. Remember to always keep the equation balanced!</p>
                    `
                }
            ]
        },
        'math_quadrilaterals': {
            sections: [
                { type: 'introduction', title: 'Shapes with Four Sides', content: `
                    <h3>Meet Quadrilaterals!</h3>
                    <p>A <strong>quadrilateral</strong> is a polygon with four sides and four vertices (corners).</p>
                    <p>You already know some quadrilaterals like squares and rectangles!</p>
                    <div class="visual-example">
                        <div style="font-size: 3rem;">⬜ ⬛ 🟨 🟥</div>
                        <p>These are all quadrilaterals!</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Types of Quadrilaterals', content: `
                    <h3>Special Quadrilaterals</h3>
                    <ul>
                        <li><strong>Parallelogram:</strong> Opposite sides are parallel and equal. Opposite angles are equal.</li>
                        <li><strong>Rectangle:</strong> A parallelogram with all angles equal to 90 degrees.</li>
                        <li><strong>Square:</strong> A rectangle with all sides equal. Diagonals bisect each other at 90 degrees.</li>
                        <li><strong>Rhombus:</strong> A parallelogram with all sides equal. Diagonals bisect each other at 90 degrees.</li>
                        <li><strong>Trapezium:</strong> Only one pair of opposite sides is parallel.</li>
                    </ul>` 
                },
                {   // MODIFIED: Practice section now returns an array of question objects
                    type: 'practice', 
                    title: 'Quadrilateral Challenge', 
                    questions: [
                        {
                            id: 'math3_q1',
                            questionText: 'A quadrilateral with all sides equal and all angles 90 degrees is a:',
                            options: [
                                { text: 'Rectangle', isCorrect: false },
                                { text: 'Square', isCorrect: true },
                                { text: 'Rhombus', isCorrect: false }
                            ]
                        },
                        {
                            id: 'math3_q2',
                            questionText: 'In a parallelogram, opposite sides are:',
                            options: [
                                { text: 'Unequal', isCorrect: false },
                                { text: 'Parallel and Equal', isCorrect: true },
                                { text: 'Perpendicular', isCorrect: false }
                            ]
                        }
                    ]
                },
                { type: 'summary', title: 'Summary: Quadrilaterals', content: `
                    <p>Quadrilaterals are common shapes around us. Knowing their properties helps us understand geometry better.</p>
                    `
                }
            ]
        },
        'math_practical_geometry': {
            sections: [
                { type: 'introduction', title: 'Drawing Shapes Accurately', content: `
                    <h3>Let's Construct!</h3>
                    <p>Practical geometry is all about drawing geometric figures accurately using tools like a ruler, compass, and protractor.</p>
                    <p>Today, we'll learn to construct different types of quadrilaterals!</p>
                    <div class="example-box">
                        <p>You need to know certain measurements (sides, angles, diagonals) to construct a unique quadrilateral.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Constructing Quadrilaterals', content: `
                    <h3>Case 1: When four sides and one diagonal are given</h3>
                    <p>1. Draw the diagonal first.</p>
                    <p>2. Using the diagonal as a base, draw two triangles using the given side lengths.</p>
                    <p>3. Join the vertices to complete the quadrilateral.</p>
                    <div class="visual-example">
                        <img src="https://via.placeholder.com/300x150?text=Quadrilateral+Construction" alt="Quadrilateral Construction Example" style="max-width:100%;">
                        <p>Visualizing the steps is key!</p>
                    </div>` 
                },
                { type: 'summary', title: 'Summary: Practical Geometry', content: `
                    <p>Accuracy is important in practical geometry. Practice helps you master the constructions.</p>
                    `
                }
            ]
        },
        'math_data_handling': {
            sections: [
                { type: 'introduction', title: 'Making Sense of Data', content: `
                    <h3>What is Data Handling?</h3>
                    <p>Data handling is about collecting, organizing, and interpreting information (data) to draw conclusions.</p>
                    <p>Imagine you want to know the favorite color of students in your class. How would you find out and show the results?</p>
                    <div class="example-box">
                        <p>Examples of data: Number of students, marks in a test, favorite sports, daily temperature.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Organizing Data', content: `
                    <h3>Frequency Distribution Tables</h3>
                    <p>To organize raw data, we can use a frequency distribution table.</p>
                    <table class="data-table">
                        <thead>
                            <tr><th>Marks</th><th>Tally Marks</th><th>Frequency</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>10-20</td><td>||||</td><td>4</td></tr>
                            <tr><td>20-30</td><td>|||||</td><td>5</td></tr>
                        </tbody>
                    </table>
                    <p>We can also represent data using bar graphs, pie charts, and histograms.</p>` 
                },
                { type: 'summary', title: 'Summary: Data Handling', content: `
                    <p>Data handling helps us understand large amounts of information easily. Visualizing data with graphs makes it even clearer.</p>
                    `
                }
            ]
        },
        'math_squares_roots': {
            sections: [
                { type: 'introduction', title: 'Squares and Square Roots', content: `
                    <h3>What is a Square Number?</h3>
                    <p>When a number is multiplied by itself, the product is called a <strong>square number</strong>.</p>
                    <div class="example-box">
                        <p>Example: 3 multiplied by 3 is 9. So, 9 is the square of 3.</p>
                        <p>We write this as: 3² = 9</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Finding Square Roots', content: `
                    <h3>The Opposite of Squaring</h3>
                    <p>The <strong>square root</strong> is the inverse operation of squaring a number.</p>
                    <p>The symbol for square root is √</p>
                    <div class="example-box">
                        <p>Example: Since 3² = 9, the square root of 9 is 3.</p>
                        <p>We write this as: √9 = 3</p>
                    </div>` 
                },
                {   // MODIFIED: Practice section now returns an array of question objects
                    type: 'practice', 
                    title: 'Squares and Square Roots Practice', 
                    questions: [
                        {
                            id: 'math4_q1',
                            questionText: 'What is the square of 5?',
                            options: [
                                { text: '10', isCorrect: false },
                                { text: '25', isCorrect: true },
                                { text: '50', isCorrect: false }
                            ]
                        },
                        {
                            id: 'math4_q2',
                            questionText: 'What is the square root of 36?',
                            options: [
                                { text: '4', isCorrect: false },
                                { text: '8', isCorrect: false },
                                { text: '6', isCorrect: true }
                            ]
                        }
                    ]
                },
                { type: 'summary', title: 'Summary: Squares and Square Roots', content: `
                    <p>Squares and square roots are important concepts in number systems. Practice helps in quick calculations.</p>
                    `
                }
            ]
        },
        'math_cubes_roots': {
            sections: [
                { type: 'introduction', title: 'Cubes and Cube Roots', content: `
                    <h3>What is a Cube Number?</h3>
                    <p>When a number is multiplied by itself <strong>three times</strong>, the product is called a <strong>cube number</strong>.</p>
                    <div class="example-box">
                        <p>Example: 2 multiplied by 2 multiplied by 2 is 8. So, 8 is the cube of 2.</p>
                        <p>We write this as: 2³ = 8</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Finding Cube Roots', content: `
                    <h3>The Opposite of Cubing</h3>
                    <p>The <strong>cube root</strong> is the inverse operation of cubing a number.</p>
                    <p>The symbol for cube root is ³√</p>
                    <div class="example-box">
                        <p>Example: Since 2³ = 8, the cube root of 8 is 2.</p>
                        <p>We write this as: ³√8 = 2</p>
                    </div>` 
                },
                { type: 'summary', title: 'Summary: Cubes and Cube Roots', content: `
                    <p>Cubes and cube roots extend our understanding of powers. They are useful in various mathematical problems.</p>
                    `
                }
            ]
        },
        'math_comparing_quantities': {
            sections: [
                { type: 'introduction', title: 'Comparing Quantities', content: `
                    <h3>Ratios and Percentages</h3>
                    <p>In our daily lives, we often compare quantities. We use <strong>ratios</strong> and <strong>percentages</strong> to do this.</p>
                    <div class="example-box">
                        <p><strong>Ratio:</strong> Comparing two quantities of the same kind. Example: If there are 3 boys and 2 girls, the ratio of boys to girls is 3:2.</p>
                        <p><strong>Percentage:</strong> A way of expressing a number as a fraction of 100. Example: 50% means 50 out of 100.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Profit, Loss, and Compound Interest', content: `
                    <h3>Business Math</h3>
                    <ul>
                        <li><strong>Profit:</strong> When Selling Price (SP) > Cost Price (CP). Profit = SP - CP.</li>
                        <li><strong>Loss:</strong> When Cost Price (CP) > Selling Price (SP). Loss = CP - SP.</li>
                        <li><strong>Simple Interest (SI):</strong> SI = (P × R × T) / 100, where P=Principal, R=Rate, T=Time.</li>
                        <li><strong>Compound Interest (CI):</strong> Interest calculated on the initial principal and also on the accumulated interest of previous periods. CI = P(1 + R/100)^N - P.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Comparing Quantities', content: `
                    <p>Comparing quantities helps us in financial calculations, business decisions, and understanding data in various forms.</p>
                    `
                }
            ]
        },
        'math_algebraic_expressions': {
            sections: [
                { type: 'introduction', title: 'Algebraic Expressions and Identities', content: `
                    <h3>Review: Expressions</h3>
                    <p>An algebraic expression is a combination of variables, constants, and operators.</p>
                    <p>Now, let's learn about multiplying these expressions and about special <strong>Identities</strong>!</p>
                    <div class="example-box">
                        <p>Example: Multiplying (x + 2) by (x + 3)</p>
                        <p>This is (x * x) + (x * 3) + (2 * x) + (2 * 3) = x² + 3x + 2x + 6 = x² + 5x + 6</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Algebraic Identities', content: `
                    <h3>Formulas for Faster Calculation</h3>
                    <p>Algebraic identities are equations that are true for all values of the variables. They are like shortcuts!</p>
                    <ul>
                        <li><strong>(a + b)² = a² + 2ab + b²</strong></li>
                        <li><strong>(a - b)² = a² - 2ab + b²</strong></li>
                        <li><strong>(a + b)(a - b) = a² - b²</strong></li>
                        <li><strong>(x + a)(x + b) = x² + (a + b)x + ab</strong></li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Algebraic Expressions and Identities', content: `
                    <p>Identities simplify complex multiplications. Mastering them makes algebra much easier and faster.</p>
                    `
                }
            ]
        },
        'math_mensuration': {
            sections: [
                { type: 'introduction', title: 'Mensuration: Area and Volume', content: `
                    <h3>Measuring Shapes</h3>
                    <p>Mensuration is the branch of mathematics that deals with the measurement of length, area, and volume of geometric shapes.</p>
                    <p>You've learned about area of squares and rectangles. Now let's explore more shapes!</p>
                    <div class="example-box">
                        <p><strong>Area:</strong> The amount of surface covered by a 2D shape (e.g., area of a field).</p>
                        <p><strong>Volume:</strong> The amount of space occupied by a 3D object (e.g., volume of water in a tank).</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Area of Various Shapes', content: `
                    <h3>Formulas for 2D Shapes</h3>
                    <ul>
                        <li><strong>Triangle:</strong> (1/2) × base × height</li>
                        <li><strong>Parallelogram:</strong> base × height</li>
                        <li><strong>Trapezium:</strong> (1/2) × (sum of parallel sides) × height</li>
                        <li><strong>Circle:</strong> πr² (where r is radius)</li>
                    </ul>` 
                },
                { type: 'lesson', title: 'Volume of 3D Shapes', content: `
                    <h3>Formulas for 3D Objects</h3>
                    <ul>
                        <li><strong>Cuboid:</strong> length × breadth × height</li>
                        <li><strong>Cube:</strong> side × side × side (or side³)</li>
                        <li><strong>Cylinder:</strong> πr²h (where r is radius, h is height)</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Mensuration', content: `
                    <p>Mensuration helps us calculate dimensions for construction, packaging, and many real-world applications. Remember your formulas!</p>
                    `
                }
            ]
        },

        // --- Science - Class 8 ---
        'science_crop_production': {
            sections: [
                { type: 'introduction', title: 'Food for All!', content: `
                    <h3>Why Do We Need Crop Production?</h3>
                    <p>All living organisms need food. Plants can make their own food, but animals and humans depend on plants and other animals for food.</p>
                    <p>To provide food for a large population, we need proper <strong>Crop Production and Management</strong>.</p>
                    <div class="example-box">
                        <p>India is an agricultural country. Farmers work hard to grow crops like wheat, rice, pulses, and vegetables.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Agricultural Practices', content: `
                    <h3>Steps in Farming</h3>
                    <ol>
                        <li><strong>Preparation of Soil:</strong> Ploughing, levelling, manuring.</li>
                        <li><strong>Sowing:</strong> Planting seeds.</li>
                        <li><strong>Adding Manure and Fertilizers:</strong> To enrich soil nutrients.</li>
                        <li><strong>Irrigation:</strong> Supplying water to crops.</li>
                        <li><strong>Protection from Weeds:</strong> Removing unwanted plants.</li>
                        <li><strong>Harvesting:</strong> Cutting the matured crop.</li>
                        <li><strong>Storage:</strong> Storing grains safely.</li>
                    </ol>` 
                },
                { type: 'summary', title: 'Summary: Crop Production and Management', content: `
                    <p>Modern agricultural practices help increase food production. Farmers play a vital role in feeding the nation.</p>
                    `
                }
            ]
        },
        'science_microorganisms': {
            sections: [
                { type: 'introduction', title: 'Tiny Organisms All Around Us', content: `
                    <h3>Microorganisms: Visible or Invisible?</h3>
                    <p>Have you ever seen organisms that you cannot see with your naked eye? These are <strong>microorganisms</strong> or <strong>microbes</strong>.</p>
                    <p>They are too small to be seen without a microscope, but they are everywhere!</p>
                    <div class="visual-example">
                        <img src="https://via.placeholder.com/300x150?text=Microscope+View" alt="Microscope view" style="max-width:100%;">
                        <p>From bacteria to fungi, they exist in vast numbers.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Friend and Foe', content: `
                    <h3>Beneficial Microorganisms</h3>
                    <ul>
                        <li><strong>Making Curd and Bread:</strong> Bacteria (Lactobacillus) helps make curd. Yeast helps ferment bread.</li>
                        <li><strong>Commercial Use:</strong> Alcohol, wine, acetic acid production.</li>
                        <li><strong>Medicinal Use:</strong> Antibiotics (e.g., Penicillin) are made from microbes. Vaccines use weakened microbes.</li>
                        <li><strong>Increasing Soil Fertility:</strong> Nitrogen-fixing bacteria enrich soil.</li>
                        <li><strong>Cleaning the Environment:</strong> Decompose organic waste.</li>
                    </ul>
                    <h3>Harmful Microorganisms</h3>
                    <ul>
                        <li><strong>Disease Causing:</strong> Cause diseases in humans (e.g., cholera, typhoid, malaria), animals, and plants.</li>
                        <li><strong>Food Poisoning:</strong> Spoil food.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Microorganisms', content: `
                    <p>Microorganisms are a crucial part of our ecosystem. Some are beneficial, while others can cause harm. Hygiene is key to staying healthy!</p>
                    `
                }
            ]
        },
        'science_synthetic_fibres': {
            sections: [
                { type: 'introduction', title: 'Man-Made Threads', content: `
                    <h3>What are Synthetic Fibres?</h3>
                    <p>You wear clothes made of cotton, silk, or wool. These are natural fibres. But what about nylon or polyester?</p>
                    <p>These are <strong>Synthetic Fibres</strong>, made by humans!</p>
                    <div class="example-box">
                        <p>Synthetic fibres are made from chemicals, often petroleum-based, through a process called polymerization.</p>
                        <p>Examples: Nylon, Rayon, Polyester, Acrylic.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Plastics: Uses and Impact', content: `
                    <h3>Everyday Plastics</h3>
                    <p>Plastics are also polymers, similar to synthetic fibres, but they can be molded into various shapes.</p>
                    <p>Uses: Containers, toys, car parts, medical devices.</p>
                    <p>Impact: Plastics are non-biodegradable, meaning they don't decompose naturally, causing pollution. Recycling and reducing plastic use are important.</p>` 
                },
                { type: 'summary', title: 'Summary: Synthetic Fibres and Plastics', content: `
                    <p>Synthetic fibres and plastics are very useful but come with environmental challenges. We must use them responsibly.</p>
                    `
                }
            ]
        },
        'science_materials': {
            sections: [
                { type: 'introduction', title: 'Metals and Non-metals', content: `
                    <h3>What are Materials Made Of?</h3>
                    <p>Look around you! You see different things like a metal spoon, a wooden table, or a plastic bottle. These are made of different <strong>materials</strong>.</p>
                    <p>We can broadly classify materials into <strong>Metals</strong> and <strong>Non-metals</strong>.</p>` 
                },
                { type: 'lesson', title: 'Properties of Metals', content: `
                    <h3>Shiny, Strong, and Conductive!</h3>
                    <ul>
                        <li><strong>Lustrous:</strong> Have a shiny appearance.</li>
                        <li><strong>Hard:</strong> Generally hard.</li>
                        <li><strong>Malleable:</strong> Can be beaten into thin sheets (e.g., aluminum foil).</li>
                        <li><strong>Ductile:</strong> Can be drawn into thin wires (e.g., copper wire).</li>
                        <li><strong>Sonorous:</strong> Produce a ringing sound when struck.</li>
                        <li><strong>Good Conductors:</strong> Conduct heat and electricity well.</li>
                    </ul>
                    <p>Examples: Iron, Copper, Gold, Silver, Aluminum.</p>` 
                },
                { type: 'lesson', title: 'Properties of Non-metals', content: `
                    <h3>Dull, Brittle, and Insulators!</h3>
                    <ul>
                        <li><strong>Non-lustrous:</strong> Dull in appearance.</li>
                        <li><strong>Brittle:</strong> Break easily when hammered (not malleable or ductile).</li>
                        <li><strong>Non-sonorous:</strong> Do not produce a ringing sound.</li>
                        <li><strong>Poor Conductors (Insulators):</strong> Do not conduct heat and electricity well (except graphite).</li>
                    </ul>
                    <p>Examples: Carbon, Sulphur, Oxygen, Nitrogen.</p>` 
                },
                { type: 'summary', title: 'Summary: Metals and Non-metals', content: `
                    <p>Metals and non-metals have distinct properties that make them suitable for different uses in our daily lives and industries.</p>
                    `
                }
            ]
        },
        'science_coal_petroleum': {
            sections: [
                { type: 'introduction', title: 'Our Energy Resources', content: `
                    <h3>Where Does Our Energy Come From?</h3>
                    <p>We use energy for almost everything: cooking, transportation, electricity, etc.</p>
                    <p>Many of these energy sources come from <strong>fossil fuels</strong> like <strong>Coal and Petroleum</strong>.</p>
                    <div class="example-box">
                        <p>Fossil fuels are formed from the decomposition of dead organisms over millions of years under high pressure and temperature.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Coal: The Black Gold', content: `
                    <h3>Formation and Uses of Coal</h3>
                    <p>Coal is a hard, black, combustible sedimentary rock found in the Earth's crust.</p>
                    <p>Formation: Formed from dead vegetation buried deep in the Earth over millions of years (carbonisation).</p>
                    <p>Uses: Fuel for cooking, heating, power generation in thermal power plants, in industries for manufacturing steel.</p>` 
                },
                { type: 'lesson', title: 'Petroleum: Liquid Gold', content: `
                    <h3>Formation and Refining of Petroleum</h3>
                    <p>Petroleum (or crude oil) is a dark, oily liquid formed from dead marine organisms buried under the sea over millions of years.</p>
                    <p>Refining: Crude oil is processed in a <strong>petroleum refinery</strong> to separate it into useful products.</p>
                    <p>Products: Petrol, diesel, kerosene, LPG, lubricating oil, paraffin wax, bitumen.</p>` 
                },
                { type: 'summary', title: 'Summary: Coal and Petroleum', content: `
                    <p>Coal and petroleum are vital non-renewable energy sources. Their judicious use and exploration of alternative energy are crucial.</p>
                    `
                }
            ]
        },
        'science_combustion': {
            sections: [
                { type: 'introduction', title: 'The Science of Burning', content: `
                    <h3>What is Combustion?</h3>
                    <p>Have you ever lit a matchstick or seen wood burning? This process is called <strong>Combustion</strong>.</p>
                    <div class="example-box">
                        <p>Combustion is a chemical process in which a substance reacts with oxygen to give off heat and light.</p>
                        <p>The substance that undergoes combustion is called a <strong>combustible substance</strong> or <strong>fuel</strong>.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Conditions for Combustion', content: `
                    <h3>What is Needed to Burn</h3>
                    <p>For combustion to occur, three things are essential (the fire triangle):</p>
                    <ol>
                        <li><strong>Fuel:</strong> A combustible substance (e.g., wood, paper, LPG).</li>
                        <li><strong>Oxygen (Air):</strong> To support combustion.</li>
                        <li><strong>Ignition Temperature:</strong> The minimum temperature at which a substance catches fire.</li>
                    </ol>
                    <p>If any of these three conditions are not met, combustion will not take place.</p>` 
                },
                { type: 'summary', title: 'Summary: Combustion and Flame', content: `
                    <p>Understanding combustion helps us use fuels safely and effectively, and also in extinguishing fires.</p>
                    `
                }
            ]
        },
        'science_conservation': {
            sections: [
                { type: 'introduction', title: 'Protecting Our Planet', content: `
                    <h3>Why Conserve Plants and Animals?</h3>
                    <p>Our planet is home to a vast variety of plants and animals. They form an important part of our ecosystem.</p>
                    <p>However, many are becoming endangered or extinct due to human activities like <strong>deforestation</strong>.</p>
                    <div class="visual-example">
                        <img src="https://via.placeholder.com/300x150?text=Deforestation+Example" alt="Deforestation" style="max-width:100%;">
                        <p>Deforestation leads to loss of habitat and environmental imbalance.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Conservation Methods', content: `
                    <h3>How Can We Protect Them?</h3>
                    <ul>
                        <li><strong>Reforestation:</strong> Planting new trees.</li>
                        <li><strong>Wildlife Sanctuaries:</strong> Areas where animals are protected from hunting.</li>
                        <li><strong>National Parks:</strong> Areas reserved for wildlife, where human activities are restricted.</li>
                        <li><strong>Biosphere Reserves:</strong> Large areas of protected land for conservation of wildlife, plant, and traditional life of tribals.</li>
                        <li><strong>Project Tiger:</strong> A famous conservation project to protect tigers.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Conservation of Plants and Animals', content: `
                    <p>Conservation is our responsibility. Protecting biodiversity ensures a healthy planet for future generations.</p>
                    `
                }
            ]
        },
        'science_cell_structure': {
    sections: [
        { type: 'introduction', title: 'The Basic Unit of Life', content: `
            <h3>What is a Cell?</h3>
            <p>Just like bricks are the basic building blocks of a house, <strong>cells</strong> are the basic structural and functional units of all living organisms.</p>
            <p>Some organisms are made of a single cell (unicellular), while others have many cells (multicellular).</p>
            <div class="visual-example">
                <img src="https://via.placeholder.com/400x200?text=Cell+Discovery" alt="Cell Discovery" style="max-width:100%;">
                <p>Robert Hooke first observed cells in 1665 while looking at cork under a microscope.</p>
            </div>
            <p>Today, we'll explore the fascinating world inside cells and understand how they function as the building blocks of life!</p>` 
        },
        { type: 'lesson', title: 'Discovery of Cells', content: `
            <h3>The Journey of Cell Discovery</h3>
            <ul>
                <li><strong>Robert Hooke (1665):</strong> First to use the term "cell" while observing cork tissue under a microscope.</li>
                <li><strong>Anton van Leeuwenhoek:</strong> First to observe living cells, including bacteria and protozoa.</li>
                <li><strong>Robert Brown (1831):</strong> Discovered the nucleus in plant cells.</li>
                <li><strong>Matthias Schleiden & Theodor Schwann:</strong> Proposed the Cell Theory.</li>
            </ul>
            <div class="example-box">
                <h4>Cell Theory (The Foundation of Biology)</h4>
                <p>1. All living things are made of one or more cells.</p>
                <p>2. The cell is the basic unit of life.</p>
                <p>3. All cells come from existing cells.</p>
            </div>` 
        },
        { type: 'lesson', title: 'Cell Structure and Organelles', content: `
            <h3>Inside a Cell - The Cellular City</h3>
            <p>Think of a cell as a busy city with different parts performing specific functions:</p>
            
            <h4>Main Components of Every Cell:</h4>
            <ol>
                <li><strong>Cell Membrane (City Wall):</strong> 
                    <ul>
                        <li>Outer boundary that controls what enters and leaves the cell</li>
                        <li>Made of lipids and proteins</li>
                        <li>Selectively permeable - allows some substances to pass through</li>
                    </ul>
                </li>
                <li><strong>Cytoplasm (City Streets):</strong>
                    <ul>
                        <li>Jelly-like substance inside the cell</li>
                        <li>Contains water, salts, and organic molecules</li>
                        <li>Where organelles are suspended and cellular activities occur</li>
                    </ul>
                </li>
                <li><strong>Nucleus (City Hall/Control Center):</strong>
                    <ul>
                        <li>Controls all cell activities</li>
                        <li>Contains genetic material (DNA) in chromosomes</li>
                        <li>Surrounded by nuclear membrane with pores</li>
                        <li>Contains nucleolus where ribosomes are made</li>
                    </ul>
                </li>
            </ol>
            
            <div class="visual-example">
                <img src="https://via.placeholder.com/400x250?text=Cell+Organelles" alt="Cell Organelles" style="max-width:100%;">
                <p>Each organelle has a specific function, just like different buildings in a city.</p>
            </div>` 
        },
        { type: 'lesson', title: 'Important Organelles and Their Functions', content: `
            <h3>The Cell's Workforce</h3>
            
            <h4>Energy and Manufacturing:</h4>
            <ul>
                <li><strong>Mitochondria (Powerhouse):</strong>
                    <ul>
                        <li>Produces energy (ATP) through cellular respiration</li>
                        <li>Has its own DNA and can reproduce</li>
                        <li>More active cells have more mitochondria</li>
                    </ul>
                </li>
                <li><strong>Ribosomes (Protein Factories):</strong>
                    <ul>
                        <li>Make proteins using instructions from DNA</li>
                        <li>Found free in cytoplasm or attached to ER</li>
                        <li>Composed of RNA and proteins</li>
                    </ul>
                </li>
            </ul>
            
            <h4>Transport and Processing:</h4>
            <ul>
                <li><strong>Endoplasmic Reticulum (Highway System):</strong>
                    <ul>
                        <li><em>Rough ER:</em> Has ribosomes, makes proteins</li>
                        <li><em>Smooth ER:</em> No ribosomes, makes lipids and detoxifies</li>
                        <li>Transports materials throughout the cell</li>
                    </ul>
                </li>
                <li><strong>Golgi Apparatus (Post Office):</strong>
                    <ul>
                        <li>Modifies, packages, and ships proteins from ER</li>
                        <li>Creates lysosomes and secretory vesicles</li>
                    </ul>
                </li>
            </ul>
            
            <h4>Storage and Cleanup:</h4>
            <ul>
                <li><strong>Vacuoles (Storage Warehouses):</strong>
                    <ul>
                        <li>Store water, salts, and other materials</li>
                        <li>Large in plant cells, small or absent in animal cells</li>
                    </ul>
                </li>
                <li><strong>Lysosomes (Cleanup Crew):</strong>
                    <ul>
                        <li>Contain digestive enzymes</li>
                        <li>Break down waste materials and worn-out organelles</li>
                        <li>Found mainly in animal cells</li>
                    </ul>
                </li>
            </ul>` 
        },
        { type: 'lesson', title: 'Plant vs. Animal Cells', content: `
            <h3>Key Differences Between Plant and Animal Cells</h3>
            
            <div class="comparison-table">
                <h4>Plant Cells Have (But Animal Cells Don't):</h4>
                <ul>
                    <li><strong>Cell Wall:</strong>
                        <ul>
                            <li>Rigid outer layer made of cellulose</li>
                            <li>Provides structural support and protection</li>
                            <li>Gives plants their shape and prevents over-expansion</li>
                        </ul>
                    </li>
                    <li><strong>Chloroplasts:</strong>
                        <ul>
                            <li>Contain chlorophyll (green pigment)</li>
                            <li>Carry out photosynthesis (making food from sunlight)</li>
                            <li>Have their own DNA and ribosomes</li>
                        </ul>
                    </li>
                    <li><strong>Large Central Vacuole:</strong>
                        <ul>
                            <li>Takes up 80-90% of cell volume</li>
                            <li>Maintains turgor pressure (keeps plant upright)</li>
                            <li>Stores water, maintains shape, and supports plant</li>
                        </ul>
                    </li>
                </ul>
                
                <h4>Animal Cells Have (But Plant Cells Don't):</h4>
                <ul>
                    <li><strong>Centrioles:</strong>
                        <ul>
                            <li>Help organize cell division</li>
                            <li>Important for forming spindle fibers</li>
                        </ul>
                    </li>
                    <li><strong>Lysosomes:</strong>
                        <ul>
                            <li>Digestive organelles</li>
                            <li>Plants use their vacuoles for similar functions</li>
                        </ul>
                    </li>
                </ul>
            </div>
            
            <div class="visual-example">
                <img src="https://via.placeholder.com/500x300?text=Plant+vs+Animal+Cell+Comparison" alt="Plant vs Animal Cell" style="max-width:100%;">
                <p>Each cell type is perfectly adapted for its organism's lifestyle and needs.</p>
            </div>` 
        },
        { type: 'practice', title: 'Cell Structure Quiz', questions: [
            {
                id: 'cell_q1',
                questionText: 'Which organelle is known as the "powerhouse of the cell"?',
                options: [
                    { text: 'Nucleus', isCorrect: false },
                    { text: 'Mitochondria', isCorrect: true },
                    { text: 'Ribosome', isCorrect: false }
                ]
            },
            {
                id: 'cell_q2',
                questionText: 'What is the main function of the cell membrane?',
                options: [
                    { text: 'Protein synthesis', isCorrect: false },
                    { text: 'Energy production', isCorrect: false },
                    { text: 'Controlling what enters and leaves the cell', isCorrect: true }
                ]
            },
            {
                id: 'cell_q3',
                questionText: 'Which structure is present in plant cells but NOT in animal cells?',
                options: [
                    { text: 'Nucleus', isCorrect: false },
                    { text: 'Cell wall', isCorrect: true },
                    { text: 'Mitochondria', isCorrect: false }
                ]
            },
            {
                id: 'cell_q4',
                questionText: 'What contains the genetic material (DNA) in a cell?',
                options: [
                    { text: 'Cytoplasm', isCorrect: false },
                    { text: 'Nucleus', isCorrect: true },
                    { text: 'Cell membrane', isCorrect: false }
                ]
            }
        ]},
        { type: 'lesson', title: 'Cell Functions and Life Processes', content: `
            <h3>How Cells Stay Alive</h3>
            
            <h4>Essential Cell Functions:</h4>
            <ol>
                <li><strong>Metabolism:</strong>
                    <ul>
                        <li>Chemical reactions that provide energy and build materials</li>
                        <li>Includes breaking down food and building new molecules</li>
                    </ul>
                </li>
                <li><strong>Growth and Repair:</strong>
                    <ul>
                        <li>Cells grow by making more organelles and increasing in size</li>
                        <li>Replace damaged parts and heal injuries</li>
                    </ul>
                </li>
                <li><strong>Reproduction:</strong>
                    <ul>
                        <li>Cells divide to create new cells</li>
                        <li>Ensures organism growth and species continuation</li>
                    </ul>
                </li>
                <li><strong>Response to Environment:</strong>
                    <ul>
                        <li>Cells detect and respond to changes</li>
                        <li>Maintain internal balance (homeostasis)</li>
                    </ul>
                </li>
            </ol>
            
            <div class="example-box">
                <h4>Amazing Cell Facts:</h4>
                <p>• Human body has about 37 trillion cells!</p>
                <p>• Red blood cells live about 120 days</p>
                <p>• Nerve cells can be over 3 feet long</p>
                <p>• Some bacteria are smaller than viruses</p>
                <p>• Ostrich eggs are the largest single cells</p>
            </div>` 
        },
        { type: 'lesson', title: 'Unicellular vs. Multicellular Organisms', content: `
            <h3>One Cell or Many?</h3>
            
            <h4>Unicellular Organisms (Single-celled):</h4>
            <ul>
                <li><strong>Examples:</strong> Bacteria, Amoeba, Paramecium, Euglena</li>
                <li><strong>Characteristics:</strong>
                    <ul>
                        <li>Entire organism is just one cell</li>
                        <li>All life functions performed by single cell</li>
                        <li>Reproduce by cell division</li>
                        <li>Usually microscopic in size</li>
                    </ul>
                </li>
                <li><strong>Advantages:</strong> Simple, can reproduce quickly, survive in harsh conditions</li>
            </ul>
            
            <h4>Multicellular Organisms (Many-celled):</h4>
            <ul>
                <li><strong>Examples:</strong> Humans, Plants, Animals, Fungi</li>
                <li><strong>Characteristics:</strong>
                    <ul>
                        <li>Made of many specialized cells</li>
                        <li>Cells work together as tissues, organs, and systems</li>
                        <li>Division of labor among different cell types</li>
                        <li>Can grow to large sizes</li>
                    </ul>
                </li>
                <li><strong>Advantages:</strong> Specialization, larger size, complex functions, better survival</li>
            </ul>
            
            <div class="visual-example">
                <img src="https://via.placeholder.com/400x200?text=Unicellular+vs+Multicellular" alt="Cell Organization" style="max-width:100%;">
                <p>From single cells to complex organisms - the journey of life!</p>
            </div>` 
        },
        { type: 'practice', title: 'Advanced Cell Knowledge', questions: [
            {
                id: 'cell_q5',
                questionText: 'Which process do chloroplasts carry out in plant cells?',
                options: [
                    { text: 'Cellular respiration', isCorrect: false },
                    { text: 'Photosynthesis', isCorrect: true },
                    { text: 'Protein synthesis', isCorrect: false }
                ]
            },
            {
                id: 'cell_q6',
                questionText: 'What is the function of ribosomes?',
                options: [
                    { text: 'Making proteins', isCorrect: true },
                    { text: 'Storing water', isCorrect: false },
                    { text: 'Controlling cell activities', isCorrect: false }
                ]
            },
            {
                id: 'cell_q7',
                questionText: 'Which type of organism is made of only one cell?',
                options: [
                    { text: 'Multicellular', isCorrect: false },
                    { text: 'Unicellular', isCorrect: true },
                    { text: 'Both types', isCorrect: false }
                ]
            }
        ]},
        { type: 'summary', title: 'Summary: Cell - Structure and Functions', content: `
            <h3>Key Takeaways</h3>
            <p>Cells are truly amazing! They are the fundamental units of life, containing all the machinery needed to sustain life processes.</p>
            
            <h4>What We Learned:</h4>
            <ul>
                <li><strong>Cell Theory:</strong> All living things are made of cells, cells are the basic unit of life, and all cells come from existing cells.</li>
                <li><strong>Cell Structure:</strong> Every cell has a cell membrane, cytoplasm, and genetic material. Many also have specialized organelles.</li>
                <li><strong>Organelle Functions:</strong> Each organelle has a specific job - from energy production to protein synthesis to waste disposal.</li>
                <li><strong>Plant vs Animal Cells:</strong> While similar in basic structure, they have key differences that reflect their different lifestyles.</li>
                <li><strong>Cell Organization:</strong> Life ranges from simple single-celled organisms to complex multicellular beings like humans.</li>
            </ul>
            
            <div class="example-box">
                <h4>Why This Matters:</h4>
                <p>Understanding cells helps us comprehend how our bodies work, how diseases occur, how medicines work, and how all life on Earth is connected. From the smallest bacteria to the largest whale, we all share the same basic cellular foundation!</p>
            </div>
            
            <p><strong>Remember:</strong> Every time you breathe, move, think, or grow, billions of cells in your body are working together to make it happen. You are literally a walking, talking community of cells!</p>
            ` 
        }
    ]
},

        'science_reproduction': {
            sections: [
                { type: 'introduction', title: 'How Life Continues', content: `
                    <h3>What is Reproduction?</h3>
                    <p>Reproduction is the process by which living organisms produce new individuals of their own kind.</p>
                    <p>It ensures the continuation of species from one generation to the next.</p>` 
                },
                { type: 'lesson', title: 'Modes of Reproduction', content: `
                    <h3>Asexual Reproduction</h3>
                    <p>Only one parent is involved. Offspring are identical to the parent.</p>
                    <ul>
                        <li><strong>Budding:</strong> (e.g., Hydra) A bud develops and detaches.</li>
                        <li><strong>Binary Fission:</strong> (e.g., Amoeba) Parent cell divides into two.</li>
                    </ul>
                    <h3>Sexual Reproduction</h3>
                    <p>Involves two parents (male and female) and the fusion of gametes (sperm and egg).</p>
                    <p>Offspring are not identical to either parent, leading to variation.</p>` 
                },
                { type: 'summary', title: 'Summary: Reproduction in Animals', content: `
                    <p>Reproduction is fundamental to life. Both asexual and sexual reproduction have unique advantages for different organisms.</p>
                    `
                }
            ]
        },
        'science_force_pressure': {
            sections: [
                { type: 'introduction', title: 'Push, Pull, and Squeeze', content: `
                    <h3>What is Force?</h3>
                    <p>A <strong>force</strong> is a push or a pull that can change the state of motion of an object, change its shape, or change its direction.</p>
                    <div class="example-box">
                        <p>Examples: Kicking a ball, pushing a door, lifting a book.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Types of Forces', content: `
                    <h3>Contact and Non-contact Forces</h3>
                    <ul>
                        <li><strong>Contact Forces:</strong> Act when objects are in direct contact.
                            <ul>
                                <li>Muscular Force (e.g., pushing a cart)</li>
                                <li>Frictional Force (e.g., rubbing hands)</li>
                            </ul>
                        </li>
                        <li><strong>Non-contact Forces:</strong> Act without direct contact.
                            <ul>
                                <li>Magnetic Force (e.g., magnets attracting)</li>
                                <li>Electrostatic Force (e.g., charged comb attracting paper)</li>
                                <li>Gravitational Force (e.g., apple falling from tree)</li>
                            </ul>
                        </li>
                    </ul>` 
                },
                { type: 'lesson', title: 'Pressure', content: `
                    <h3>Force Over an Area</h3>
                    <p><strong>Pressure</strong> is the force acting per unit area.</p>
                    <p>Formula: Pressure = Force / Area</p>
                    <p>Units: Pascal (Pa) or N/m²</p>
                    <div class="example-box">
                        <p>A sharp knife cuts better because it applies more pressure over a smaller area.</p>
                        <p>Atmospheric Pressure: The pressure exerted by the air around us.</p>
                    </div>` 
                },
                { type: 'summary', title: 'Summary: Force and Pressure', content: `
                    <p>Force and pressure are fundamental concepts in physics that explain how objects interact and how forces are distributed.</p>
                    `
                }
            ]
        },

        // --- English - Class 8 ---
        'english_honeydew_1': {
            sections: [
                { type: 'introduction', title: 'The Best Christmas Present in the World', content: `
                    <h3>A Heartwarming Story</h3>
                    <p>This story by Michael Morpurgo is about a Christmas mystery and a touching discovery.</p>
                    <p>It explores themes of war, peace, and the power of human connection.</p>` 
                },
                { type: 'lesson', title: 'Characters and Plot', content: `
                    <h3>Meet Jim Macpherson and Connie</h3>
                    <ul>
                        <li><strong>Jim Macpherson:</strong> An English soldier who writes a letter from the trenches during World War I.</li>
                        <li><strong>Connie Macpherson:</strong> Jim's wife, who receives the letter.</li>
                        <li><strong>The Narrator:</strong> Finds Jim's letter in an old desk.</li>
                    </ul>
                    <p>The story unfolds as the narrator reads Jim's letter, describing a magical Christmas truce between English and German soldiers.</p>` 
                },
                { type: 'summary', title: 'Summary: The Best Christmas Present in the World', content: `
                    <p>This story reminds us of the shared humanity even amidst conflict and the enduring power of love and hope.</p>
                    `
                }
            ]
        },
        'english_honeydew_2': {
            sections: [
                { type: 'introduction', title: 'The Tsunami', content: `
                    <h3>Understanding Natural Disasters</h3>
                    <p>A <strong>tsunami</strong> is a series of ocean waves caused by large-scale disturbances, most commonly underwater earthquakes.</p>
                    <p>This lesson shares real-life stories of courage and survival during the devastating 2004 Indian Ocean Tsunami.</p>` 
                },
                { type: 'lesson', title: 'Stories of Survival', content: `
                    <h3>Ignatius, Sanjeev, and Tilly Smith</h3>
                    <ul>
                        <li><strong>Ignatius:</strong> A manager of a cooperative society, whose family was swept away.</li>
                        <li><strong>Sanjeev:</strong> A policeman who bravely tried to rescue others but was also swept away.</li>
                        <li><strong>Tilly Smith:</strong> A young British schoolgirl who recognized the signs of a tsunami and saved many lives on a beach in Thailand.</li>
                    </ul>
                    ` 
                },
                { type: 'summary', title: 'Summary: The Tsunami', content: `
                    <p>The Tsunami teaches us about the immense power of nature and the incredible resilience and bravery of humans in the face of disaster.</p>
                    `
                }
            ]
        },
        'english_honeydew_3': {
            sections: [
                { type: 'introduction', title: 'Glimpses of the Past', content: `
                    <h3>Looking Back in Time</h3>
                    <p>This lesson presents glimpses of important historical events from India's past, leading up to the First War of Independence in 1857.</p>
                    <p>It uses comic strip format to make history engaging.</p>` 
                },
                { type: 'lesson', title: 'Key Events and Figures', content: `
                    <h3>From Company Rule to Rebellion</h3>
                    <ul>
                        <li><strong>The East India Company:</strong> Its expansion and exploitation.</li>
                        <li><strong>Tipu Sultan:</strong> The Tiger of Mysore, who resisted the British.</li>
                        <li><strong>Raja Ram Mohan Roy:</strong> A social reformer who advocated for education and against social evils.</li>
                        <li><strong>The Sepoy Mutiny (1857):</strong> The rebellion sparked by various grievances.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Glimpses of the Past', content: `
                    <p>Understanding our past helps us appreciate the struggles for freedom and the making of our nation.</p>
                    `
                }
            ]
        },
        'english_grammar_1': {
            sections: [
                { type: 'introduction', title: 'The Building Blocks of Sentences', content: `
                    <h3>What is a Sentence?</h3>
                    <p>A <strong>sentence</strong> is a group of words that makes complete sense. It expresses a complete thought.</p>
                    <div class="example-box">
                        <p>Example: "The sun shines brightly." (Complete sense)</p>
                        <p>Not a sentence: "Shines brightly the sun." (Doesn't make complete sense)</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Types of Sentences', content: `
                    <h3>Based on Purpose:</h3>
                    <ul>
                        <li><strong>Assertive/Declarative:</strong> States a fact or opinion. (e.g., "Birds fly.")</li>
                        <li><strong>Interrogative:</strong> Asks a question. (e.g., "Are you happy?")</li>
                        <li><strong>Imperative:</strong> Gives a command or makes a request. (e.g., "Close the door.")</li>
                        <li><strong>Exclamatory:</strong> Expresses strong emotion. (e.g., "What a beautiful day!")</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: The Sentence', content: `
                    <p>Sentences are the foundation of communication. Knowing their types helps us write and speak clearly.</p>
                    `
                }
            ]
        },
        'english_grammar_2': {
            sections: [
                { type: 'introduction', title: 'Parts of Speech Revisited', content: `
                    <h3>Review: 8 Parts of Speech</h3>
                    <p>Every word in a sentence plays a specific role. These roles are called <strong>Parts of Speech</strong>.</p>
                    <p>We'll look at Nouns, Pronouns, Verbs, and Adjectives in more detail.</p>` 
                },
                { type: 'lesson', title: 'Nouns and Pronouns', content: `
                    <h3>Naming Words and Their Substitutes</h3>
                    <ul>
                        <li><strong>Noun:</strong> A word that names a person, place, animal, thing, or idea. (e.g., Rahul, Delhi, table, honesty)</li>
                        <li><strong>Pronoun:</strong> A word used in place of a noun. (e.g., He, she, it, they, you)</li>
                    </ul>
                    <div class="example-box">
                        <p>Rahul is a boy. <strong>He</strong> plays cricket.</p>
                        <p>'Rahul' is a Noun, 'He' is a Pronoun.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Verbs and Adjectives', content: `
                    <h3>Action Words and Describing Words</h3>
                    <ul>
                        <li><strong>Verb:</strong> A word that describes an action, state, or occurrence. (e.g., run, eat, is, seem)</li>
                        <li><strong>Adjective:</strong> A word that describes or modifies a noun or pronoun. (e.g., beautiful, big, red, smart)</li>
                    </ul>
                    <div class="example-box">
                        <p>The <strong>big</strong> dog <strong>ran</strong> quickly.</p>
                        <p>'big' is an Adjective, 'ran' is a Verb.</p>
                    </div>` 
                },
                { type: 'summary', title: 'Summary: Parts of Speech', content: `
                    <p>Mastering parts of speech helps in constructing grammatically correct and meaningful sentences.</p>
                    `
                }
            ]
        },
        'english_writing_1': {
            sections: [
                { type: 'introduction', title: 'Formal Letter Writing', content: `
                    <h3>Writing for Official Purposes</h3>
                    <p>A <strong>formal letter</strong> is written for official communication, such as to a principal, a government official, or a business.</p>
                    <p>It follows a specific format and tone.</p>` 
                },
                { type: 'lesson', title: 'Format of a Formal Letter', content: `
                    <h3>Key Components:</h3>
                    <ol>
                        <li><strong>Sender's Address:</strong> Your address.</li>
                        <li><strong>Date:</strong> Date of writing.</li>
                        <li><strong>Receiver's Address:</strong> Address of the person you're writing to.</li>
                        <li><strong>Subject:</strong> A brief description of the letter's purpose.</li>
                        <li><strong>Salutation:</strong> (e.g., "Sir/Madam", "Dear Mr./Ms.")</li>
                        <li><strong>Body:</strong> Main content in clear paragraphs.</li>
                        <li><strong>Complimentary Close:</strong> (e.g., "Yours sincerely", "Yours faithfully")</li>
                        <li><strong>Sender's Name and Signature.</strong></li>
                    </ol>` 
                },
                { type: 'summary', title: 'Summary: Formal Letter Writing', content: `
                    <p>Formal letters require precision and a structured approach. Practice writing different types of formal letters.</p>
                    `
                }
            ]
        },
        'english_writing_2': {
            sections: [
                { type: 'introduction', title: 'Unleash Your Imagination: Story Writing', content: `
                    <h3>Crafting Narratives</h3>
                    <p><strong>Story writing</strong> is the art of creating a narrative, a sequence of events, that entertains, informs, or evokes emotions in the reader.</p>
                    <p>It's a fantastic way to express your creativity!</p>` 
                },
                { type: 'lesson', title: 'Elements of a Good Story', content: `
                    <h3>What Makes a Story Great?</h3>
                    <ul>
                        <li><strong>Characters:</strong> The people or animals in the story.</li>
                        <li><strong>Setting:</strong> Where and when the story takes place.</li>
                        <li><strong>Plot:</strong> The sequence of events, including a conflict and resolution.</li>
                        <li><strong>Theme:</strong> The main idea or message of the story.</li>
                        <li><strong>Climax:</strong> The most exciting or important part of the story.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Story Writing', content: `
                    <p>A compelling story combines interesting characters, a vivid setting, and an engaging plot. Practice makes perfect!</p>
                    `
                }
            ]
        },

        // --- Hindi - Class 8 ---
        'hindi_vasant_1': {
            sections: [
                { type: 'introduction', title: 'ध्वनि (कविता)', content: `
                    <h3>सूर्यकांत त्रिपाठी 'निराला'</h3>
                    <p>यह कविता सूर्यकांत त्रिपाठी 'निराला' द्वारा रचित है। इसमें कवि प्रकृति के माध्यम से जीवन में आशा और उत्साह का संदेश देते हैं।</p>
                    <p>कवि कहते हैं कि अभी उनका अंत नहीं होगा, क्योंकि अभी तो उनके जीवन में वसंत आया है।</p>` 
                },
                { type: 'lesson', title: 'कविता का भावार्थ', content: `
                    <h3>प्रकृति और जीवन</h3>
                    <p>कवि फूलों और कलियों के माध्यम से युवा पीढ़ी को आलस्य त्यागकर अपने जीवन को कर्मठ बनाने की प्रेरणा देते हैं।</p>
                    <p>वे चाहते हैं कि हर व्यक्ति अपने जीवन में कुछ अच्छा करके जाए, ताकि उसका जीवन सार्थक हो सके।</p>` 
                },
                { type: 'summary', title: 'सारांश: ध्वनि', content: `
                    <p>यह कविता हमें जीवन में सकारात्मकता, आशा और कर्मठता का संदेश देती है।</p>
                    `
                },
            ]
        },
        'hindi_vasant_2': {
            sections: [
                { type: 'introduction', title: 'लाख की चूड़ियाँ (कहानी)', content: `
                    <h3>कामतानाथ द्वारा रचित</h3>
                    <p>यह कहानी कामतानाथ द्वारा लिखी गई है। इसमें लेखक ने बदलू नामक मनिहार (चूड़ियाँ बनाने वाला) के माध्यम से ग्रामीण उद्योग और मशीनी युग के प्रभाव को दर्शाया है।</p>
                    <p>यह कहानी हमें पारंपरिक कारीगरों के जीवन में आ रहे बदलावों से परिचित कराती है।</p>` 
                },
                { type: 'lesson', title: 'बदलू का व्यक्तित्व', content: `
                    <h3>मनिहार बदलू</h3>
                    <p>बदलू बहुत सुंदर लाख की चूड़ियाँ बनाता था। गाँव की सभी स्त्रियाँ उसकी बनाई चूड़ियाँ ही पहनती थीं।</p>
                    <p>वह स्वभाव से बहुत सीधा और संतोषी था। उसे अपनी कला पर बहुत गर्व था।</p>
                    <p>लेकिन मशीनी चूड़ियाँ आने के बाद उसका काम बंद हो गया, जिससे वह उदास रहने लगा।</p>` 
                },
                { type: 'summary', title: 'सारांश: लाख की चूड़ियाँ', content: `
                    <p>यह कहानी हमें पारंपरिक उद्योगों के महत्व और मशीनीकरण के कारण उनके सामने आने वाली चुनौतियों के बारे में सोचने पर मजबूर करती है।</p>
                    `
                }
            ]
        },
        'hindi_vasant_3': {
            sections: [
                { type: 'introduction', title: 'बस की यात्रा (व्यंग्य)', content: `
                    <h3>हरिशंकर परसाई का व्यंग्य</h3>
                    <p>यह हरिशंकर परसाई द्वारा रचित एक हास्य-व्यंग्य कहानी है। इसमें लेखक ने एक पुरानी, खटारा बस की यात्रा का वर्णन किया है।</p>
                    <p>यह कहानी हमें सार्वजनिक परिवहन की खराब स्थिति और यात्रियों की समस्याओं पर सोचने को मजबूर करती है।</p>` 
                },
                { type: 'lesson', title: 'यात्रा का अनुभव', content: `
                    <h3>पुरानी बस का हाल</h3>
                    <p>लेखक और उनके चार मित्र पन्ना से सतना जाने के लिए बस में बैठते हैं। बस इतनी पुरानी थी कि उसे देखकर लगता था कि वह कभी भी खराब हो सकती है।</p>
                    <p>यात्रा के दौरान बस बार-बार रुकती है, टायर पंचर हो जाते हैं, और इंजन भी आवाजें करता है।</p>
                    <p>लेखक ने व्यंग्यपूर्ण ढंग से बस की दयनीय स्थिति का वर्णन किया है।</p>` 
                },
                { type: 'summary', title: 'सारांश: बस की यात्रा', content: `
                    <p>यह व्यंग्य कहानी हमें समाज में व्याप्त अव्यवस्थाओं और भ्रष्टाचार पर हँसते-हँसते सोचने पर मजबूर करती है।</p>
                    `
                }
            ]
        },
        'hindi_grammar_1': {
            sections: [
                { type: 'introduction', title: 'वर्ण और वर्णमाला', content: `
                    <h3>भाषा की सबसे छोटी इकाई</h3>
                    <p>भाषा की सबसे छोटी इकाई को <strong>वर्ण</strong> कहते हैं। वर्णों के व्यवस्थित समूह को <strong>वर्णमाला</strong> कहते हैं।</p>
                    <p>हिंदी वर्णमाला में स्वर और व्यंजन होते हैं।</p>` 
                },
                { type: 'lesson', title: 'स्वर और व्यंजन', content: `
                    <h3>स्वर (Vowels)</h3>
                    <p>जो वर्ण बिना किसी दूसरे वर्ण की सहायता से बोले जाते हैं, उन्हें स्वर कहते हैं।</p>
                    <p>उदाहरण: अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ (कुल 11)</p>
                    <h3>व्यंजन (Consonants)</h3>
                    <p>जो वर्ण स्वरों की सहायता से बोले जाते हैं, उन्हें व्यंजन कहते हैं।</p>
                    <p>उदाहरण: क, ख, ग, घ, ङ (क वर्ग)</p>
                    <div class="example-box">
                        <p>क = क् + अ</p>
                        <p>ख = ख् + अ</p>
                    </div>` 
                },
                { type: 'summary', title: 'सारांश: वर्ण और वर्णमाला', content: `
                    <p>वर्ण और वर्णमाला हिंदी भाषा का आधार हैं। स्वरों और व्यंजनों को समझना भाषा सीखने के लिए आवश्यक है।</p>
                    `
                }
            ]
        },
        'hindi_grammar_2': {
            sections: [
                { type: 'introduction', title: 'संज्ञा (Noun)', content: `
                    <h3>नाम बताने वाले शब्द</h3>
                    <p>किसी व्यक्ति, वस्तु, स्थान, जाति या भाव के नाम को <strong>संज्ञा</strong> कहते हैं।</p>
                    <div class="example-box">
                        <p>व्यक्ति: राम, सीता</p>
                        <p>वस्तु: किताब, मेज</p>
                        <p>स्थान: दिल्ली, स्कूल</p>
                        <p>भाव: खुशी, बचपन</p>
                    </div>` 
                },
                { type: 'lesson', title: 'संज्ञा के भेद (Types of Noun)', content: `
                    <h3>मुख्य तीन भेद:</h3>
                    <ol>
                        <li><strong>व्यक्तिवाचक संज्ञा:</strong> किसी विशेष व्यक्ति, वस्तु या स्थान का नाम। (उदा. गंगा, हिमालय, महात्मा गांधी)</li>
                        <li><strong>जातिवाचक संज्ञा:</strong> किसी जाति या वर्ग का बोध कराने वाले शब्द। (उदा. लड़का, नदी, शहर, पुस्तक)</li>
                        <li><strong>भाववाचक संज्ञा:</strong> किसी भाव, गुण, दशा या अवस्था का बोध कराने वाले शब्द। (उदा. मिठास, बचपन, बुढ़ापा, ईमानदारी)</li>
                    </ol>` 
                },
                { type: 'summary', title: 'सारांश: संज्ञा', content: `
                    <p>संज्ञा हिंदी व्याकरण का एक महत्वपूर्ण अंग है। संज्ञा के भेदों को समझना वाक्य संरचना में मदद करता है।</p>
                    `
                }
            ]
        },
        'hindi_writing_1': {
            sections: [
                { type: 'introduction', title: 'पत्र लेखन (Letter Writing)', content: `
                    <h3>अपने विचार व्यक्त करने का माध्यम</h3>
                    <p><strong>पत्र लेखन</strong> अपने विचारों, भावनाओं और सूचनाओं को लिखित रूप में किसी दूसरे व्यक्ति तक पहुँचाने का एक महत्वपूर्ण माध्यम है।</p>
                    <p>पत्र दो प्रकार के होते हैं: औपचारिक (Formal) और अनौपचारिक (Informal)।</p>` 
                },
                { type: 'lesson', title: 'औपचारिक पत्र (Formal Letter)', content: `
                    <h3>सरकारी या व्यावसायिक पत्र</h3>
                    <p>औपचारिक पत्र उन लोगों को लिखे जाते हैं जिनसे हमारा व्यक्तिगत संबंध नहीं होता, जैसे प्रधानाचार्य, अधिकारी, संपादक आदि।</p>
                    <p>इनका प्रारूप निश्चित होता है और भाषा शिष्ट तथा मर्यादित होती है।</p>
                    <p>मुख्य अंग: प्रेषक का पता, दिनांक, पाने वाले का पता, विषय, संबोधन, मुख्य भाग, समापन, प्रेषक का नाम।</p>` 
                },
                { type: 'lesson', title: 'अनौपचारिक पत्र (Informal Letter)', content: `
                    <h3>व्यक्तिगत संबंधियों को पत्र</h3>
                    <p>अनौपचारिक पत्र अपने मित्रों, संबंधियों या परिवार के सदस्यों को लिखे जाते हैं।</p>
                    <p>इनमें भाषा और शैली व्यक्तिगत होती है और कोई निश्चित प्रारूप नहीं होता।</p>` 
                },
                { type: 'summary', title: 'सारांश: पत्र लेखन', content: `
                    <p>पत्र लेखन एक महत्वपूर्ण कौशल है। औपचारिक और अनौपचारिक पत्रों के प्रारूप और भाषा का ध्यान रखना आवश्यक है।</p>
                    `
                }
            ]
        },

        // --- Social Science - Class 8 ---
        'social_history_1': {
            sections: [
                { type: 'introduction', title: 'How, When and Where', content: `
                    <h3>Understanding History</h3>
                    <p>History is about how things were in the past and how things have changed over time. It's about understanding <strong>how, when, and where</strong> events happened.</p>
                    <p>Dates are important in history, but so is understanding the context and causes of events.</p>` 
                },
                { type: 'lesson', title: 'Sources of History', content: `
                    <h3>Where Do We Find History?</h3>
                    <p>Historians use various sources to reconstruct the past:</p>
                    <ul>
                        <li><strong>Official Records:</strong> Government documents, administrative reports.</li>
                        <li><strong>Surveys:</strong> British conducted surveys to map India.</li>
                        <li><strong>Letters and Diaries:</strong> Personal accounts.</li>
                        <li><strong>Newspapers and Magazines:</strong> Public opinions and events.</li>
                        <li><strong>Books and Autobiographies.</strong></li>
                        <li><strong>Monuments and Artifacts.</strong></li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: How, When and Where', content: `
                    <p>History helps us understand our present and plan for the future. Critical analysis of historical sources is crucial.</p>
                    `
                }
            ]
        },
        'social_history_2': {
            sections: [
                { type: 'introduction', title: 'From Trade to Territory', content: `
                    <h3>The British East India Company</h3>
                    <p>This chapter traces the journey of the British East India Company from a trading company to a colonial power that established its rule over India.</p>
                    <p>It highlights how trade interests gradually transformed into territorial ambitions.</p>` 
                },
                { type: 'lesson', title: 'Expansion of Company Rule', content: `
                    <h3>Key Strategies:</h3>
                    <ul>
                        <li><strong>Wars:</strong> Battles of Plassey (1757) and Buxar (1764) established British dominance.</li>
                        <li><strong>Subsidiary Alliance:</strong> Indian rulers had to keep British forces and pay for them.</li>
                        <li><strong>Doctrine of Lapse:</strong> If an Indian ruler died without a natural male heir, his kingdom would lapse to the British.</li>
                        <li><strong>Annexation:</strong> Direct annexation of territories.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: From Trade to Territory', content: `
                    <p>The British East India Company's expansion marked a significant period in Indian history, leading to colonial rule and eventual independence struggles.</p>
                    `
                }
            ]
        },
        'social_geography_1': {
            sections: [
                { type: 'introduction', title: 'Resources: Our Lifelines', content: `
                    <h3>What is a Resource?</h3>
                    <p>Anything that can be used to satisfy a need is a <strong>resource</strong>.</p>
                    <p>The utility or usability of a thing is what makes it a resource.</p>
                    <div class="example-box">
                        <p>Examples: Water, electricity, rickshaw, vegetables, textbooks.</p>
                    </div>` 
                },
                { type: 'lesson', title: 'Types of Resources', content: `
                    <h3>Natural, Human-Made, and Human Resources</h3>
                    <ul>
                        <li><strong>Natural Resources:</strong> Obtained from nature and used without much modification (e.g., air, water, minerals, forests).</li>
                        <li><strong>Human-Made Resources:</strong> Created by humans using natural resources (e.g., buildings, roads, machines, vehicles).</li>
                        <li><strong>Human Resources:</strong> People themselves are resources with their knowledge, skills, and technology.</li>
                    </ul>` 
                },
                { type: 'lesson', title: 'Conservation of Resources', content: `
                    <h3>Using Resources Wisely</h3>
                    <p>Using resources carefully and giving them time to get renewed is called <strong>resource conservation</strong>.</p>
                    <p><strong>Sustainable Development:</strong> Balancing the need to use resources with the need to conserve them for the future.</p>` 
                },
                { type: 'summary', title: 'Summary: Resources', content: `
                    <p>Resources are essential for our survival and development. Their wise use and conservation are vital for a sustainable future.</p>
                    `
                }
            ]
        },
        'social_geography_2': {
            sections: [
                { type: 'introduction', title: 'Land, Soil, Water, Natural Vegetation and Wildlife Resources', content: `
                    <h3>Our Planet's Wealth</h3>
                    <p>This chapter explores the most important natural resources: <strong>Land, Soil, Water, Natural Vegetation, and Wildlife</strong>.</p>
                    <p>These resources are crucial for human life and the environment.</p>` 
                },
                { type: 'lesson', title: 'Land and Soil Resources', content: `
                    <h3>Land Use and Soil Formation</h3>
                    <ul>
                        <li><strong>Land:</strong> Used for agriculture, forestry, mining, building houses, roads, and setting up industries.</li>
                        <li><strong>Soil:</strong> The thin layer of grainy substance covering the surface of the Earth. Formed by weathering of rocks.</li>
                        <li><strong>Soil Conservation:</strong> Methods like mulching, contour barriers, terrace farming, shelterbelts.</li>
                    </ul>` 
                },
                { type: 'lesson', title: 'Water, Vegetation, and Wildlife', content: `
                    <h3>Essential for Life</h3>
                    <ul>
                        <li><strong>Water:</strong> Essential for all life forms. Water cycle ensures its renewal.</li>
                        <li><strong>Natural Vegetation:</strong> Forests, grasslands, shrubs. Provides timber, oxygen, habitat for wildlife.</li>
                        <li><strong>Wildlife:</strong> Animals, birds, insects, aquatic life. Important for ecological balance.</li>
                        <li><strong>Conservation:</strong> National parks, wildlife sanctuaries, biosphere reserves protect these resources.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Natural Resources', content: `
                    <p>These natural resources are interconnected. Their conservation is vital for maintaining ecological balance and supporting life on Earth.</p>
                    `
                }
            ]
        },
        'social_civics_1': {
            sections: [
                { type: 'introduction', title: 'The Indian Constitution', content: `
                    <h3>Rules for Our Nation</h3>
                    <p>A <strong>Constitution</strong> is a set of rules and principles that all persons in a country can agree upon as the basis of the way in which they want the country to be governed.</p>
                    <p>The <strong>Indian Constitution</strong> is the supreme law of India.</p>` 
                },
                { type: 'lesson', title: 'Key Features of Indian Constitution', content: `
                    <h3>Pillars of Our Democracy</h3>
                    <ul>
                        <li><strong>Federalism:</strong> More than one level of government (Union, State, Local).</li>
                        <li><strong>Parliamentary Form of Government:</strong> Representatives elected by the people.</li>
                        <li><strong>Separation of Powers:</strong> Between Legislature, Executive, and Judiciary.</li>
                        <li><strong>Fundamental Rights:</strong> Rights guaranteed to all citizens (e.g., Right to Equality, Right to Freedom).</li>
                        <li><strong>Secularism:</strong> The state does not officially promote any one religion.</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: The Indian Constitution', content: `
                    <p>The Indian Constitution is a living document that guides our nation. It protects our rights and ensures a democratic society.</p>
                    `
                }
            ]
        },
        'social_civics_2': {
            sections: [
                { type: 'introduction', title: 'Understanding Secularism', content: `
                    <h3>Religion and the State</h3>
                    <p><strong>Secularism</strong> refers to the separation of religion from the State.</p>
                    <p>In India, the state maintains a principled distance from all religions.</p>` 
                },
                { type: 'lesson', title: 'Indian Secularism', content: `
                    <h3>Key Aspects:</h3>
                    <ul>
                        <li><strong>No Official Religion:</strong> India does not have a state religion.</li>
                        <li><strong>Freedom to Practice:</strong> All citizens are free to profess, practice, and propagate any religion.</li>
                        <li><strong>Non-interference:</strong> The state does not interfere in religious affairs.</li>
                        <li><strong>Intervention:</strong> The state can intervene in religious matters to end social evils (e.g., banning untouchability).</li>
                    </ul>` 
                },
                { type: 'summary', title: 'Summary: Understanding Secularism', content: `
                    <p>Secularism is a fundamental value of the Indian Constitution, ensuring equality and freedom of religion for all citizens.</p>
                    `
                }
            ]
        }
    };
    
    return contentDatabase[lesson.id] || {
        sections: [
            {
                type: 'introduction',
                title: lesson.title,
                content: `
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description}</p>
                    <p>This lesson content is being developed. Stay tuned for interactive content!</p>
                `
            }
        ]
    };
};
