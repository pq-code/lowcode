import { Form } from "./components/Form";
import { Container } from "./components/Container";
import { Table } from "./components/Table";
import { Input } from "./components/Input";
import { Select } from "./components/Select";
import { Image } from "./components/Image";
import { Divider } from "./components/Divider";
import { Carousel } from "./components/Carousel";
import { PageHeader } from "./components/PageHeader";
import { Backtop } from "./components/backtop";
import { Breadcrumb } from "./components/Breadcrumb";
import { Button } from "./components/Button";
import { Search } from "./components/Search";
import componentRegistry from './componentRegistry';
import type { ComponentDescriptor } from './componentRegistry';

// 定义组件
const components = [
  Container,
  Form,
  Table,
  Input,
  Select,
  Image,
  Divider,
  Carousel,
  Backtop,
  PageHeader,
  Breadcrumb,
  Button,
  Search
];

// 将所有组件注册到组件注册中心
componentRegistry.registerMany(components as ComponentDescriptor[]);

// 组件列表，用于拖拽面板展示
const componentList: ComponentDescriptor[] = [];

// 将组件从注册中心加载到组件列表
const setComponentList = () => {
  // 清空组件列表
  componentList.length = 0;
  
  // 从注册中心获取所有组件描述
  const descriptors = componentRegistry.getAllDescriptors();
  
  // 添加到组件列表
  descriptors.forEach(descriptor => {
    componentList.push(descriptor);
  });
  
  return componentList;
};

// 初始化组件列表
setComponentList();

export { componentList, setComponentList, componentRegistry };
