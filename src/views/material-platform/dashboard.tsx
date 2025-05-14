import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'MaterialDashboard',
  setup() {
    onMounted(() => {
      console.log('物料概览页已加载');
    });

    return () => (
      <div class="dashboard">
        <h2>物料概览</h2>
        <div class="dashboard-content">
          <div class="stats-cards">
            <div class="stats-card">
              <div class="stats-number">12</div>
              <div class="stats-title">组件总数</div>
            </div>
            <div class="stats-card">
              <div class="stats-number">5</div>
              <div class="stats-title">分组总数</div>
            </div>
            <div class="stats-card">
              <div class="stats-number">3</div>
              <div class="stats-title">今日新增</div>
            </div>
          </div>
          
          <div class="recent-materials">
            <h3>最近添加的物料</h3>
            <ul class="material-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <li class="material-item" key={i}>
                  <div class="material-name">示例按钮 {i}</div>
                  <div class="material-date">2023-06-{10 + i}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}); 