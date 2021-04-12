// 深度优先遍历，数据扁平化
export const flatArray = (data = [], childrenName = 'children') => {
    const result: any[] = [];
    const loop = (array: any[]) => {
        array.forEach(item => {
            if (item[childrenName]) {
                const newItem = {...item};
                // delete newItem[childrenName];
                result.push(newItem);
                if (item[childrenName].length > 0) {
                    loop(item[childrenName]);
                }
            } else {
                result.push(item);
            }
        });
    };
    loop(data);
    return result;
}
