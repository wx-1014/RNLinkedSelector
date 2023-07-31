本组件是基于react-native 开发的三级联动组件，也可更具自己的需要修改为四级或者五级
**DEMO**
```
const areas = [
  {
    areazone: '杭州市',
    children: [
      {
        areazone: '上城区',
        street: 'a',
        children: [
          { areazone: '四季青街道', street: '1' },
          { areazone: '采荷街道', street: '2' },
        ],
      },
      {
        areazone: '西湖区',
        street: 'b',
        children: [
          { areazone: '北山街道', street: '3' },
          { areazone: '留下街道', street: '4' },
        ],
      },
    ],
  },
];
<AddressPicker areaData={areas}/>
```
