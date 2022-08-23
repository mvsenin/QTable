QTable inplements plain table for Qlik Sense almost standard filteting behaviour and advanced measure functionality which supports:
1. \<url\>, \<img\>, \<app\> tags added after the measure value lead to advanced visualization features
2. due to <url> you can implement "real drill-down" behaviour by use of [Single Integration API](https://help.qlik.com/en-US/sense-developer/May2022/Subsystems/APIs/Content/Sense_ClientAPIs/single-integration-api.htm)
3. you can specify total expression for the measures

Just add your dimensions & measures and have a fun. -)

The implementation is derived from https://github.com/PabloSLabbe/QSTable, thanks to Pablo!
