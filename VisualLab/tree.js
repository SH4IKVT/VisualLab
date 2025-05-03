class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.color = 'red'; // For Red-Black Tree
        this.height = 1; // For AVL Tree
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (this.root === null) {
            this.root = newNode;
            return;
        }
        this._insert(this.root, newNode);
    }

    _insert(node, newNode) {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
                newNode.parent = node;
            } else {
                this._insert(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
                newNode.parent = node;
            } else {
                this._insert(node.right, newNode);
            }
        }
    }

    delete(value) {
        this.root = this._delete(this.root, value);
    }

    _delete(node, value) {
        if (node === null) return null;

        if (value < node.value) {
            node.left = this._delete(node.left, value);
        } else if (value > node.value) {
            node.right = this._delete(node.right, value);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            let minNode = this._findMin(node.right);
            node.value = minNode.value;
            node.right = this._delete(node.right, minNode.value);
        }

        return node;
    }

    _findMin(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    inorderTraversal(node = this.root) {
        if (node === null) return [];
        return [
            ...this.inorderTraversal(node.left),
            node.value,
            ...this.inorderTraversal(node.right)
        ];
    }
}

class RedBlackTree extends BinarySearchTree {
    constructor() {
        super();
    }

    insert(value) {
        const newNode = new Node(value);
        this.root = this._insert(this.root, newNode);
        this._fixInsert(newNode);
    }

    _insert(node, newNode) {
        if (node === null) return newNode;

        if (newNode.value < node.value) {
            node.left = this._insert(node.left, newNode);
            if (node.left) node.left.parent = node;
        } else if (newNode.value > node.value) {
            node.right = this._insert(node.right, newNode);
            if (node.right) node.right.parent = node;
        }

        return node;
    }

    _fixInsert(node) {
        while (node !== this.root && node.parent?.color === 'red') {
            if (node.parent === node.parent.parent?.left) {
                const uncle = node.parent.parent.right;
                if (uncle?.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this._rotateLeft(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this._rotateRight(node.parent.parent);
                    node = this._rotateRight(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent?.left;
                if (uncle?.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this._rotateRight(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this._rotateLeft(node.parent.parent);
                    node = this._rotateLeft(node.parent.parent);
                }
            }
        }
        this.root.color = 'black';
    }

    _rotateLeft(x) {
        const y = x.right;
        
        x.right = y.left;
        if (y.left) y.left.parent = x;
        
        // Update y's parent
        y.parent = x.parent;
        
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        
        // Update x's parent
        y.left = x;
        x.parent = y;
        
        return y; 
    }

    _rotateRight(x) {
        const y = x.left;
        
        x.left = y.right;
        if (y.right) y.right.parent = x;
        
        // Update y's parent
        y.parent = x.parent;
        
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        
        y.right = x;
        x.parent = y;
        
        return y; 
    }

    delete(value) {
        const node = this._findNode(this.root, value);
        if (node === null) return;

        const originalColor = node.color;
        let x = null;

        if (node.left === null) {
            x = node.right;
            this._transplant(node, node.right);
        } else if (node.right === null) {
            x = node.left;
            this._transplant(node, node.left);
        } else {
            const minNode = this._findMin(node.right);
            originalColor = minNode.color;
            x = minNode.right;
            if (minNode.parent === node) {
                if (x) x.parent = minNode;
            } else {
                this._transplant(minNode, minNode.right);
                minNode.right = node.right;
                minNode.right.parent = minNode;
            }
            this._transplant(node, minNode);
            minNode.left = node.left;
            minNode.left.parent = minNode;
            minNode.color = node.color;
        }

        if (originalColor === 'black') {
            this._fixDelete(x);
        }
    }

    _findNode(node, value) {
        if (node === null) return null;
        if (value < node.value) return this._findNode(node.left, value);
        if (value > node.value) return this._findNode(node.right, value);
        return node;
    }

    _transplant(u, v) {
        if (u.parent === null) this.root = v;
        else if (u === u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        if (v) v.parent = u.parent;
    }

    _fixDelete(x) {
        while (x !== this.root && (x === null || x.color === 'black')) {
            if (x === x?.parent?.left) {
                const w = x.parent.right;
                if (w?.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this._rotateLeft(x.parent);
                    w = x.parent.right;
                }
                if ((w?.left?.color === 'black' || w?.left === null) &&
                    (w?.right?.color === 'black' || w?.right === null)) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w?.right?.color === 'black' || w?.right === null) {
                        w.left.color = 'black';
                        w.color = 'red';
                        this._rotateRight(w);
                        w = x.parent.right;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.right.color = 'black';
                    this._rotateLeft(x.parent);
                    x = this.root;
                }
            } else {
                const w = x.parent.left;
                if (w?.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this._rotateRight(x.parent);
                    w = x.parent.left;
                }
                if ((w?.right?.color === 'black' || w?.right === null) &&
                    (w?.left?.color === 'black' || w?.left === null)) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w?.left?.color === 'black' || w?.left === null) {
                        w.right.color = 'black';
                        w.color = 'red';
                        this._rotateLeft(w);
                        w = x.parent.left;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.left.color = 'black';
                    this._rotateRight(x.parent);
                    x = this.root;
                }
            }
        }
        if (x) x.color = 'black';
    }
}

class AVLTree extends BinarySearchTree {
    constructor() {
        super();
    }

    insert(value) {
        this.root = this._insert(this.root, value);
    }

    _insert(node, value) {
        if (node === null) {
            return new Node(value);
        }

        if (value < node.value) {
            node.left = this._insert(node.left, value);
        } else if (value > node.value) {
            node.right = this._insert(node.right, value);
        }

        node.height = 1 + Math.max(
            this._getHeight(node.left),
            this._getHeight(node.right)
        );

        let balance = this._getBalance(node);

        if (balance > 1 && value < node.left.value) {
            return this._rotateRight(node);
        }

        if (balance < -1 && value > node.right.value) {
            return this._rotateLeft(node);
        }

        if (balance > 1 && value > node.left.value) {
            node.left = this._rotateLeft(node.left);
            return this._rotateRight(node);
        }

        if (balance < -1 && value < node.right.value) {
            node.right = this._rotateRight(node.right);
            return this._rotateLeft(node);
        }

        return node;
    }

    _getHeight(node) {
        return node ? node.height : 0;
    }

    _getBalance(node) {
        return node ? this._getHeight(node.left) - this._getHeight(node.right) : 0;
    }

    _rotateLeft(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== null) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent === null) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;

        x.height = 1 + Math.max(
            this._getHeight(x.left),
            this._getHeight(x.right)
        );
        y.height = 1 + Math.max(
            this._getHeight(y.left),
            this._getHeight(y.right)
        );

        return y;
    }

    _rotateRight(x) {
        let y = x.left;
        x.left = y.right;
        if (y.right !== null) y.right.parent = x;
        y.parent = x.parent;
        if (x.parent === null) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.right = x;
        x.parent = y;

        x.height = 1 + Math.max(
            this._getHeight(x.left),
            this._getHeight(x.right)
        );
        y.height = 1 + Math.max(
            this._getHeight(y.left),
            this._getHeight(y.right)
        );

        return y;
    }
}
