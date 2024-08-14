import { getConstraintType } from '../../constraintTypes'

function activityToXml (activityModel) {
  const definition = `
      <activity id="${activityModel.activityId()}" name="${activityModel.activityName()}">
          <authorization/>
          <datamodel/>
      </activity>
      `
  const graphical = `
          <cell height="${activityModel.height()}" id="${activityModel.activityId()}" width="${activityModel.width()}" x="${activityModel.x()}" y="${activityModel.y()}"/>
      `
  return {
    definition,
    graphical
  }
}

function constraintToXml (constraintModel) {
  const type = getConstraintType(constraintModel.constraintName())
  const definition = type.getXML(
    constraintModel.constraintId(),
    constraintModel.sourceActivityId(),
    constraintModel.sourceActivityName(),
    constraintModel.targetActivityId(),
    constraintModel.targetActivityName()
  )
  const graphical = `
        <cell height="1.0" id="${constraintModel.constraintId()}" width="1.0" x="${constraintModel.x()}" y="${constraintModel.y()}"/>
    `
  return {
    definition,
    graphical
  }
}

export default function modelToXml (model) {
  const activitiesDefinition = model.data.activities.map(a => activityToXml(a).definition).join('\n')
  const activitiesGraphical = model.data.activities.map(a => activityToXml(a).graphical).join('\n')

  const constraints = model.data.constraints.map(c => constraintToXml(c).definition).join('\n')
  const constraintsGraphical = model.data.constraints.map(c => constraintToXml(c).graphical).join('\n')

  const xml = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<model>
  <assignment language="ConDec" name="${model.name()}" ident="${model.id()}">
      <activitydefinitions>
          ${activitiesDefinition}
      </activitydefinitions>
      <constraintdefinitions>
          ${constraints}
      </constraintdefinitions>
      <data/>
      <team/>
      <graphical>
          <activities>
              ${activitiesGraphical}
          </activities>
          <constraints>
              ${constraintsGraphical}
          </constraints>
      </graphical>
  </assignment>
</model>
`

  return xml
}
