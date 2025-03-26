import { Process } from '../types/process';

// Interface for nodes in our temporary tree structure
interface ProcessTreeNode {
    process: Process;
    children: ProcessTreeNode[];
    depth: number;
}

// Interface for the flattened list items passed to the table
export interface DisplayProcess extends ProcessTreeNode {
    hasChildren: boolean; // Simplified check for rendering the toggle
}

/**
 * Builds a tree structure from a flat list of processes.
 * @param processes - The flat list of processes.
 * @returns A map where keys are process IDs and values are tree nodes.
 */
function buildProcessTree(processes: Process[]): Map<number, ProcessTreeNode> {
    const nodes = new Map<number, ProcessTreeNode>();
    const rootNodes: ProcessTreeNode[] = [];

    // First pass: create nodes for all processes
    processes.forEach((p) => {
        nodes.set(p.id, { process: p, children: [], depth: 0 }); // Initial depth 0
    });

    // Second pass: build hierarchy and identify roots
    processes.forEach((p) => {
        const node = nodes.get(p.id);
        if (!node) return; // Should not happen if first pass worked

        if (p.parent_process_id !== null && nodes.has(p.parent_process_id)) {
            const parentNode = nodes.get(p.parent_process_id)!;
            parentNode.children.push(node);
        } else {
            // If parent_process_id is null or parent doesn't exist in the list, it's a root
            rootNodes.push(node);
        }
    });

    // Third pass: calculate depth recursively (starting from roots)
    function setDepth(node: ProcessTreeNode, depth: number) {
        node.depth = depth;
        node.children.forEach((child) => setDepth(child, depth + 1));
    }
    rootNodes.forEach((root) => setDepth(root, 0));

    return nodes; // Return the map containing all nodes with updated depth and children
}

/**
 * Flattens the process tree for display, respecting expanded nodes.
 * @param processes - The flat list of processes.
 * @param expandedIds - A Set containing the IDs of expanded processes.
 * @returns A flat list of DisplayProcess objects ready for rendering.
 */
export function getDisplayProcesses(
    processes: Process[],
    expandedIds: Set<number>,
): DisplayProcess[] {
    const treeMap = buildProcessTree(processes);
    const displayList: DisplayProcess[] = [];
    const roots = processes.filter(
        (p) =>
            p.parent_process_id === null || !treeMap.has(p.parent_process_id!),
    );

    function flatten(node: ProcessTreeNode) {
        const displayNode: DisplayProcess = {
            ...node,
            hasChildren: node.children.length > 0,
        };
        displayList.push(displayNode);

        // If the node is expanded and has children, recursively add them
        if (displayNode.hasChildren && expandedIds.has(node.process.id)) {
            // Sort children alphabetically by name (optional)
            const sortedChildren = [...node.children].sort((a, b) =>
                a.process.name.localeCompare(b.process.name),
            );
            sortedChildren.forEach(flatten);
        }
    }

    // Start flattening from root nodes, sorting roots alphabetically
    const sortedRoots = roots
        .map((p) => treeMap.get(p.id)!)
        .filter(Boolean) // Filter out potential undefined if a root wasn't in treeMap somehow
        .sort((a, b) => a.process.name.localeCompare(b.process.name));

    sortedRoots.forEach(flatten);

    return displayList;
}
