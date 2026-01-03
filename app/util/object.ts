import type {Textbook, TextbookOption} from "~/type/textbook";

export const ArrayUtil = {
  /**
   * 将 Textbook 树形结构转换为 TextbookOption 结构
   */
  mapTextbookToOption: (list: Textbook[]): TextbookOption[] => {
    return list.map((item) => ({
      value: item.id.toString(),
      label: item.label,
      // 关键：将原始对象挂载到 raw 字段
      raw: item,
      children: item.children ? ArrayUtil.mapTextbookToOption(item.children) : undefined
    }));
  },

  /**
   * 在树中查找指定 value 的完整路径
   * @param tree 树数据
   * @param targetValue 目标节点的 value (对应 id.toString())
   * @returns 节点路径数组（包含 label 或整个对象，按需返回）
   */
  findPath: (tree: TextbookOption[], targetValue: string): TextbookOption[] | null => {
    for (const node of tree) {
      // 1. 如果匹配当前节点，直接返回当前节点组成的数组
      if (node.value === targetValue) {
        return [node];
      }

      // 2. 如果有子节点，递归查找
      if (node.children) {
        const path = ArrayUtil.findPath(node.children, targetValue);
        if (path) {
          // 3. 如果在子节点中找到了，将当前节点拼在路径最前面
          return [node, ...path];
        }
      }
    }
    // 4. 没找到返回 null
    return null;
  },
};
