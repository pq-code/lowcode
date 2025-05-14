/**
 * 物料区域组件
 * 负责提供拖拽物料的组件列表
 */
import { Button } from './components/Button';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Table } from './components/Table';
import { Select } from './components/Select';
import { Search } from './components/Search';
import { Form } from './components/Form';
import { Divider } from './components/Divider';
import { Image } from './components/Image';
import { Breadcrumb } from './components/Breadcrumb';
import { Carousel } from './components/Carousel';
import { PageHeader } from './components/PageHeader';
import { backtop as Backtop } from './components/backtop';

// 导入核心物料服务
import { getAllMaterials } from '@/core/material/services/MaterialService';

/**
 * 获取所有物料组件
 * @returns 物料组件数组
 */
export function getMaterialComponents() {
  // 优先使用核心物料服务获取物料
  const coreMaterials = getAllMaterials();
  if (coreMaterials && coreMaterials.length > 0) {
    return coreMaterials;
  }
  
  // 如果核心物料服务没有数据，使用本地物料
  return [
    Button,
    Container,
    Input,
    Table,
    Select,
    Search,
    Form,
    Divider,
    Image,
    Breadcrumb,
    Carousel,
    PageHeader,
    Backtop,
  ];
}

/**
 * 物料区域兼容层
 * 提供与旧系统兼容的API，但使用新的物料服务
 */
import type { Material } from '@/core/material/types/MaterialTypes';

/**
 * 获取所有物料
 * @returns 物料数组
 */
export function getAllMaterialComponents(): Material[] {
  return getMaterialComponents() as Material[];
}

/**
 * 物料分组
 * @param materials 物料列表
 * @returns 分组后的物料
 */
export function groupMaterials(materials: Material[]) {
  const groups: Record<string, Material[]> = {};
  
  materials.forEach(item => {
    const group = item.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  });
  
  return groups;
}

export default {
  getAllMaterialComponents,
  groupMaterials
};
