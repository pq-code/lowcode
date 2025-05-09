
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

function arrayToObject(arr) {
  return arr.reduce((obj, item) => {
    obj[item.type] = item;
    return obj;
  }, {});
}

// 定义组件类型
type ComponentType = typeof components[number];

const componentList: ComponentType[] = [];

const setComponentList = () => {
  Object.keys(componentMap).forEach((e) => {
    componentList.push(componentMap[e]);
  });
  return componentList;
}

let componentMap = {} as { [key: string]: ComponentType };

componentMap = arrayToObject(components);
setComponentList();

export { componentList, setComponentList };
