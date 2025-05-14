import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'ComponentsManager',
  setup() {
    onMounted(() => {
      console.log('组件管理页已加载');
    });
    
    return () => (
      <div class="components-manager">
        <h2>组件管理</h2>
        <div class="components-content">
          <div class="toolbar">
            <div class="search-box">
              <input type="text" placeholder="搜索组件..." class="search-input" />
            </div>
            <div class="toolbar-actions">
              <button class="btn-primary">添加组件</button>
              <button class="btn-default">批量导入</button>
            </div>
          </div>
          
          <div class="components-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>序号</th>
                  <th style={{ width: '200px' }}>组件名称</th>
                  <th>描述</th>
                  <th style={{ width: '100px' }}>分类</th>
                  <th style={{ width: '100px' }}>版本</th>
                  <th style={{ width: '150px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>示例组件 {i + 1}</td>
                    <td>这是一个示例组件，用于展示组件管理功能</td>
                    <td>{(i + 1) % 2 === 0 ? '基础组件' : '布局组件'}</td>
                    <td>1.0.{i + 1}</td>
                    <td>
                      <a href="#" class="op-link">编辑</a>
                      <a href="#" class="op-link">预览</a>
                      <a href="#" class="op-link op-danger">删除</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div class="pagination">
            <span class="page-info">共 10 条</span>
            <div class="page-buttons">
              <button class="page-btn page-prev" disabled>&lt;</button>
              <button class="page-btn page-current">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn page-next">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}); 