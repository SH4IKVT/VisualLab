class TreeVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tree = null;
        this.treeType = 'bst';
        this.nodeSize = 30;
        this.nodeSpacing = 100;
        this.logElement = document.getElementById('log');
        this.initialize();
        this.loadTreeState();
    }

    initialize() {
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.6;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth * 0.8;
            this.canvas.height = window.innerHeight * 0.6;
            this.drawTree();
        });
    }

    setupEventListeners() {
        const treeTypeSelect = document.getElementById('treeType');
        const numberInput = document.getElementById('numberInput');
        const insertBtn = document.getElementById('insertBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        const clearBtn = document.getElementById('clearBtn');

        treeTypeSelect.addEventListener('change', (e) => {
            this.treeType = e.target.value;
            this.tree = null;
            this.clearLog();
            this.drawTree();
        });

        insertBtn.addEventListener('click', () => {
            const value = parseInt(numberInput.value);
            if (!isNaN(value)) {
                this.insertNode(value);
                numberInput.value = '';
            }
        });

        deleteBtn.addEventListener('click', () => {
            const value = parseInt(numberInput.value);
            if (!isNaN(value)) {
                this.deleteNode(value);
                numberInput.value = '';
            }
        });

        clearBtn.addEventListener('click', () => {
            this.clearStorage();
        });
    }

    createTree() {
        if (this.treeType === 'bst') {
            return new BinarySearchTree();
        } else if (this.treeType === 'rbt') {
            return new RedBlackTree();
        } else if (this.treeType === 'avl') {
            return new AVLTree();
        }
        return null;
    }

    async insertNode(value) {
        if (!this.tree) {
            this.tree = this.createTree();
        }
        
        if (this.treeType === 'bst') {
            this.tree.insert(value);
        } else if (this.treeType === 'rbt') {
            this.tree.insert(value);
        } else if (this.treeType === 'avl') {
            this.tree.insert(value);
        }
        this.drawTree();
    }

    async animateBSTInsert(value) {
        await this.tree.insert(value);
        while (currentNode !== null) {
            parentNode = currentNode;
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        // Insert new node
        if (parentNode === null) {
            this.tree.root = newNode;
        } else if (value < parentNode.value) {
            parentNode.left = newNode;
            newNode.parent = parentNode;
        } else {
            parentNode.right = newNode;
            newNode.parent = parentNode;
        }

        // Animate insertion
        await this.animateTree(newNode, 'insert');
        this.logOperation(`Inserted: ${value}`);
        this.drawTree();
    }

    async animateRBInsert(value) {
        const newNode = new Node(value);
        let currentNode = this.tree.root;
        let parentNode = null;
        
        // Find insertion point
        while (currentNode !== null) {
            parentNode = currentNode;
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        // Insert new node
        if (parentNode === null) {
            this.tree.root = newNode;
        } else if (value < parentNode.value) {
            parentNode.left = newNode;
            newNode.parent = parentNode;
        } else {
            parentNode.right = newNode;
            newNode.parent = parentNode;
        }

        // Animate insertion
        await this.animateTree(newNode, 'insert');
        
        // Fix Red-Black properties
        await this.animateRBFix(newNode);
        
        this.logOperation(`Inserted: ${value}`);
        this.drawTree();
    }

    async animateRBFix(node) {
        while (node !== this.tree.root && node.parent?.color === 'red') {
            if (node.parent === node.parent.parent?.left) {
                const uncle = node.parent.parent.right;
                if (uncle?.color === 'red') {
                    // Case 1: Uncle is red
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                    await this.animateTree(node, 'color');
                } else {
                    if (node === node.parent.right) {
                        // Case 2: Right child of left child
                        node = node.parent;
                        await this.animateTree(node, 'rotate-left');
                        await this._rotateLeft(node);
                    }
                    // Case 3: Left child of left child
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    await this.animateTree(node.parent.parent, 'rotate-right');
                    await this._rotateRight(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent?.left;
                if (uncle?.color === 'red') {
                    // Case 1: Uncle is red
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                    await this.animateTree(node, 'color');
                } else {
                    if (node === node.parent.left) {
                        // Case 2: Left child of right child
                        node = node.parent;
                        await this.animateTree(node, 'rotate-right');
                        await this._rotateRight(node);
                    }
                    // Case 3: Right child of right child
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    await this.animateTree(node.parent.parent, 'rotate-left');
                    await this._rotateLeft(node.parent.parent);
                }
            }
        }
        this.tree.root.color = 'black';
    }

    async animateAVLInsert(value) {
        const newNode = new Node(value);
        let currentNode = this.tree.root;
        let parentNode = null;
        
        // Find insertion point
        while (currentNode !== null) {
            parentNode = currentNode;
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        // Insert new node
        if (parentNode === null) {
            this.tree.root = newNode;
        } else if (value < parentNode.value) {
            parentNode.left = newNode;
            newNode.parent = parentNode;
        } else {
            parentNode.right = newNode;
            newNode.parent = parentNode;
        }

        // Animate insertion
        await this.animateTree(newNode, 'insert');
        
        // Fix AVL properties
        await this.animateAVLFix(newNode);
        
        this.logOperation(`Inserted: ${value}`);
        this.drawTree();
    }

    async animateAVLFix(node) {
        while (node !== null) {
            // Update height
            node.height = 1 + Math.max(
                this.tree._getHeight(node.left),
                this.tree._getHeight(node.right)
            );

            // Check balance
            const balance = this.tree._getBalance(node);

            // Left Left Case
            if (balance > 1 && this.tree._getBalance(node.left) >= 0) {
                await this.animateTree(node, 'rotate-right');
                this.tree._rotateRight(node);
            }

            // Left Right Case
            if (balance > 1 && this.tree._getBalance(node.left) < 0) {
                await this.animateTree(node.left, 'rotate-left');
                await this.tree._rotateLeft(node.left);
                await this.animateTree(node, 'rotate-right');
                this.tree._rotateRight(node);
            }

            // Right Right Case
            if (balance < -1 && this.tree._getBalance(node.right) <= 0) {
                await this.animateTree(node, 'rotate-left');
                this.tree._rotateLeft(node);
            }

            // Right Left Case
            if (balance < -1 && this.tree._getBalance(node.right) > 0) {
                await this.animateTree(node.right, 'rotate-right');
                await this.tree._rotateRight(node.right);
                await this.animateTree(node, 'rotate-left');
                this.tree._rotateLeft(node);
            }

            node = node.parent;
        }
    }

    async animateTree(node, action) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.drawTree();
                if (action === 'insert') {
                    this.highlightNode(node, 'insert');
                } else if (action === 'color') {
                    this.highlightNode(node, 'color');
                } else if (action === 'rotate-left') {
                    this.highlightNode(node, 'rotate-left');
                } else if (action === 'rotate-right') {
                    this.highlightNode(node, 'rotate-right');
                }
                setTimeout(resolve, 1000); // 1 second delay for animation
            });
        });
    }

    highlightNode(node, action) {
        const nodes = this.getNodesForDrawing();
        const nodeData = nodes.find(n => n.node === node);
        
        if (nodeData) {
            this.ctx.beginPath();
            this.ctx.arc(nodeData.x, nodeData.y, this.nodeSize / 2, 0, Math.PI * 2);
            
            if (action === 'insert') {
                this.ctx.fillStyle = 'rgba(67, 160, 71, 0.5)'; // Light green
            } else if (action === 'color') {
                this.ctx.fillStyle = 'rgba(255, 152, 0, 0.5)'; // Light orange
            } else if (action === 'rotate-left') {
                this.ctx.fillStyle = 'rgba(255, 87, 34, 0.5)'; // Light red
            } else if (action === 'rotate-right') {
                this.ctx.fillStyle = 'rgba(3, 169, 244, 0.5)'; // Light blue
            }
            
            this.ctx.fill();
        }
    }

    deleteNode(value) {
        if (this.tree) {
            this.tree.delete(value);
            this.logOperation(`Deleted: ${value}`);
            this.saveTreeState();
            this.drawTree();
        }
    }

    logOperation(message) {
        const log = document.createElement('div');
        log.textContent = message;
        this.logElement.appendChild(log);
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }

    clearLog() {
        this.logElement.innerHTML = '';
    }

    drawTree() {
        if (!this.tree) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const nodes = this.getNodesForDrawing();
        this.drawNodes(nodes);
        this.drawEdges(nodes);
    }

    // Save tree state to localStorage
    saveTreeState() {
        if (!this.tree) return;

        // Convert tree to array for storage
        const treeData = this.tree.inorderTraversal();
        localStorage.setItem('treeType', this.treeType);
        localStorage.setItem('treeData', JSON.stringify(treeData));
    }

    // Load tree state from localStorage
    loadTreeState() {
        const savedType = localStorage.getItem('treeType');
        const savedData = localStorage.getItem('treeData');

        if (savedType && savedData) {
            this.treeType = savedType;
            const data = JSON.parse(savedData);
            this.tree = this.createTree();
            
            // Rebuild the tree
            data.forEach(value => {
                this.tree.insert(value);
            });
            
            this.drawTree();
        }
    }

    // Clear all stored data
    clearStorage() {
        localStorage.removeItem('treeType');
        localStorage.removeItem('treeData');
        this.tree = null;
        this.clearLog();
        this.drawTree();
    }

    // Get nodes for drawing with their positions
    getNodesForDrawing() {
        const nodes = [];
        const queue = [{ node: this.tree.root, level: 0, pos: 0, x: this.canvas.width / 2, y: 50 }];

        while (queue.length > 0) {
            const { node, level, pos, x, y } = queue.shift();
            
            if (node) {
                nodes.push({ node, level, pos, x, y });
                
                const leftPos = pos * 2;
                const rightPos = (pos * 2) + 1;
                
                if (node.left) {
                    const leftX = x - this.nodeSpacing;
                    const leftY = y + (this.nodeSize + 20);
                    queue.push({ node: node.left, level: level + 1, pos: leftPos, x: leftX, y: leftY });
                }
                if (node.right) {
                    const rightX = x + this.nodeSpacing;
                    const rightY = y + (this.nodeSize + 20);
                    queue.push({ node: node.right, level: level + 1, pos: rightPos, x: rightX, y: rightY });
                }
            }
        }

        return nodes;
    }

    drawNodes(nodes) {
        nodes.forEach(nodeInfo => {
            const { node, x, y } = nodeInfo;

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.nodeSize / 2, 0, Math.PI * 2);
            
            let color = 'green';
            if (node.color === 'red') color = 'red';
            if (node.color === 'black') color = 'black';

            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = 'white';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.value.toString(), x, y + 4);
        });
    }

    drawEdges(nodes) {
        nodes.forEach(nodeInfo => {
            const { node, x, y } = nodeInfo;
            if (!node) return;

            if (node.left) {
                const leftX = x - this.nodeSpacing;
                const leftY = y + (this.nodeSize + 20);
                this.drawEdge(x, y, leftX, leftY);
            }

            if (node.right) {
                const rightX = x + this.nodeSpacing;
                const rightY = y + (this.nodeSize + 20);
                this.drawEdge(x, y, rightX, rightY);
            }
        });
    }

    drawEdge(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new TreeVisualizer('treeCanvas');
});
