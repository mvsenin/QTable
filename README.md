QTable inplements plain table for Qlik Sense with almost standard filteting behaviour and advanced measure functionality which supports:
1. The \<url\>, \<urlcss/\>, \<img\>, \<app\> tags added after the measure value lead to advanced visualization features
2. The \<url\> and \<urlcss/\> tags help implementing "real drill-down" behaviour by use of [Single Integration API](https://help.qlik.com/en-US/sense-developer/May2022/Subsystems/APIs/Content/Sense_ClientAPIs/single-integration-api.htm)
  - \<urlcss/\> allows adding css \<style\> attribute value, for instance, \<urlcss color: #ff0000; urlcss/\> will make \<a\> link text red
3. Also you can specify total expression for the measures

Just add your dimensions & measures and have a fun. -)

The implementation is derived from https://github.com/PabloSLabbe/QSTable, thanks to Pablo!
