class ConstraintType {
  constructor (name, params) {
    this.name = name
    this.params = params
    this.icon = undefined
    this.iconViewBox = '0 0 2000 2000'
    this.props = {}
  }

  getXML (sourceId, sourceName, targetId, targetName) {
    return '---'
  }

  toString () {
    return `${this.name} (${this.params.join(', ')})`
  }
}

/*
*/
class Init extends ConstraintType {
  constructor () {
    super('Init', ['A'])
  }
}

/*
*/
class End extends ConstraintType {
  constructor () {
    super('End', ['A'])
  }
}

/*
*/
class Existence extends ConstraintType {
  constructor () {
    super('Existence', ['A'])
    this.props.min = '0'
    this.props.max = 'X'
  }
}
/*
*/
class Absence extends ConstraintType {
  constructor () {
    super('Absence', ['A'])
  }
}
/*
*/
class Choice extends ConstraintType {
  constructor () {
    super('Choice', ['A', 'B'])
    this.icon = '<defs><style>.af343096-c093-4d85-84db-519242665e1e,.bd72eab5-0f0c-4323-9fe5-f852c3084f19{fill:#fff;}.bd72eab5-0f0c-4323-9fe5-f852c3084f19{stroke:#231f20;stroke-miterlimit:10;stroke-width:40.15px;}.af343096-c093-4d85-84db-519242665e1e{stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:79.33px;}</style></defs><title>easyDeclare</title><g id="f4aaee85-04fb-4592-8f29-fe1e960585fe" data-name="DECLARE"><rect class="bd72eab5-0f0c-4323-9fe5-f852c3084f19" x="276.37" y="276.37" width="1447.25" height="1447.25" rx="181.94" transform="translate(-414.21 1000) rotate(-45)"/><circle class="af343096-c093-4d85-84db-519242665e1e" cx="1000" cy="1000" r="470.95"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `<constraint id="${id}" mandatory="true">
              <condition/>
              <name>choice</name>
              <template>
                  <description>At least one from A and B has to be executed.</description>
                  <display>choice</display>
                  <name>choice</name>
                  <text>(  &lt;&gt; ( "A" ) / &lt;&gt;( "B" )  )</text>
                  <parameters>
                      <parameter branchable="true" id="1" name="A">
                          <graphical>
                              <style number="1"/>
                              <begin fill="false" style="0"/>
                              <middle fill="false" style="0"/>
                              <end fill="false" style="9"/>
                          </graphical>
                      </parameter>
                      <parameter branchable="true" id="2" name="B">
                          <graphical>
                              <style number="1"/>
                              <begin fill="false" style="0"/>
                              <middle fill="false" style="0"/>
                              <end fill="false" style="0"/>
                          </graphical>
                      </parameter>
                  </parameters>
                  <statemessages>
                      <message state="SATISFIED">SATISFIED undefined</message>
                      <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
                      <message state="VIOLATED">VIOLATED undefined</message>
                  </statemessages>
              </template>
              <constraintparameters>
                  <parameter templateparameter="1">
                      <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
                      </branches>
                  </parameter>
                  <parameter templateparameter="2">
                      <branches>
                          <branch id="${targetId}" name="${targetName}"/>
                      </branches>
                  </parameter>
              </constraintparameters>
          </constraint>
      `
  }
}
/*
*/
class ExclusiveChoice extends ConstraintType {
  constructor () {
    super('ExclusiveChoice', ['A', 'B'])
    this.icon = '<defs><style>.a24369aa-a646-41f5-9afd-95db696c70f0{fill:#fff;stroke:#231f20;stroke-miterlimit:10;stroke-width:39.66px;}.a9a884d6-4e3d-4055-9a5d-ba6deb98e494{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:79.32px;}</style></defs><title>easyDeclare</title><g id="aec1a777-3d43-4f47-a319-cf206e144434" data-name="DECLARE"><rect class="a24369aa-a646-41f5-9afd-95db696c70f0" x="276.05" y="276.54" width="1447.25" height="1447.25" rx="181.94" transform="translate(-414.43 999.82) rotate(-45)"/><line class="a9a884d6-4e3d-4055-9a5d-ba6deb98e494" x1="1361.28" y1="638.57" x2="638.08" y2="1361.77"/><line class="a9a884d6-4e3d-4055-9a5d-ba6deb98e494" x1="638.08" y1="638.57" x2="1361.28" y2="1361.77"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>exclusive choice</name>
          <template>
              <description>A or B has to happen but not both.</description>
              <display>exclusive choice</display>
              <name>exclusive choice</name>
              <text>(  ( &lt;&gt;( "A" ) / &lt;&gt;( "B" )  )  / !( (  &lt;&gt;( "A" ) / &lt;&gt;( "B" ) ) ) )</text>
              <parameters>
                  <parameter branchable="true" id="1" name="A">
                      <graphical>
                          <style number="1"/>
                          <begin fill="false" style="0"/>
                          <middle fill="false" style="0"/>
                          <end fill="true" style="9"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="true" id="2" name="B">
                      <graphical>
                          <style number="1"/>
                          <begin fill="false" style="0"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">SATISFIED undefined</message>
                  <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
                  <message state="VIOLATED">VIOLATED undefined</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}
/*
*/
class Response extends ConstraintType {
  constructor () {
    super('Response', ['A', 'B'])
    this.icon = '<defs><style>.bd4faf86-436e-415c-bb60-d505657102a5{fill:#fff;}.a95db924-e242-4e03-a9f3-86f6650475bf,.bdf4603b-a1eb-4db6-825b-d2c7e5d8681c,.e640ee2e-bd08-4fb1-973f-f98fea3fc5fb{fill:none;stroke-miterlimit:10;}.bdf4603b-a1eb-4db6-825b-d2c7e5d8681c{stroke:#231f20;stroke-width:40px;}.a95db924-e242-4e03-a9f3-86f6650475bf,.e640ee2e-bd08-4fb1-973f-f98fea3fc5fb{stroke:#000;}.e640ee2e-bd08-4fb1-973f-f98fea3fc5fb{stroke-width:80px;}.a95db924-e242-4e03-a9f3-86f6650475bf{stroke-width:129px;}</style></defs><title>easyDeclare</title><g id="a016d740-d0f0-4c34-8ecd-4c896f9aeb9f" data-name="Layer 2"><rect class="bd4faf86-436e-415c-bb60-d505657102a5" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="bdf4603b-a1eb-4db6-825b-d2c7e5d8681c" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="529.47" y="370.05" width="195.04" height="1257.9" rx="18.96"/><rect class="e640ee2e-bd08-4fb1-973f-f98fea3fc5fb" x="529.47" y="370.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1671.15,1043.23c28-23.78,28-62.68,0-86.46L1042.29,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="a95db924-e242-4e03-a9f3-86f6650475bf" d="M1671.15,1043.23c28-23.78,28-62.68,0-86.46L1042.29,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>response</name>
          <template>
              <description>Whenever activity &lt;b&gt;activity 1&lt;/b&gt; is executed, activity &lt;b&gt;activity 2&lt;/b&gt; has to be eventually executed afterwards.</description>
              <display>response</display>
              <name>response</name>
              <text>[]( ( "A" -&gt; &lt;&gt;( "B" ) ) )</text>
              <parameters>
                  <parameter branchable="true" id="2" name="A">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="5"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="true" id="1" name="B">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="2"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">&lt;html&gt;&lt;p&gt; There are  two options when this constraint is satisfied:&lt;/p&gt;
                  &lt;ul&gt;
                  &lt;li&gt;Either task &amp;quot;A&amp;quot; has not been executed yet, or&lt;/li&gt;
                  &lt;li&gt;Task &amp;quot;A&amp;quot; has been executed, and task &amp;quot;B&amp;quot; has been executed at least once after task &amp;quot;A&amp;quot;.&lt;/li&gt;
                  &lt;/ul&gt;&lt;/html&gt;</message>
                                  <message state="VIOLATED_TEMPORARY">&lt;html&gt;&lt;p&gt;This constraint is temporarily violated because task &amp;quot;A&amp;quot; has been executed, 
                  and task &amp;quot;B&amp;quot; was not executed after task &amp;quot;A&amp;quot;.&lt;/p&gt;
                  &lt;p&gt;Execute task &amp;quot;B&amp;quot; at least once to satisfy this constraint. &lt;/p&gt;&lt;/html&gt;</message>
                                  <message state="VIOLATED">&lt;html&gt;&lt;p&gt;This constraint is (permanently) violated when the instance is closed 
                  such that task &amp;quot;A&amp;quot; was executed, 
                  but task &amp;quot;B&amp;quot; was not executed after task &amp;quot;A&amp;quot;.&lt;/p&gt;
                  &lt;/html&gt;&lt;/html&gt;</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}
/*
*/
class Precedence extends ConstraintType {
  constructor () {
    super('Precedence', ['A', 'B'])
    this.icon = '<defs><style>.b0ab7708-516e-46f2-b750-dfd414f31224{fill:#fff;}.aaa81a56-a3ae-4ab2-aa4f-2303b2870c66,.ad28f883-cd73-4be8-9f9e-d988af6477bf,.faa27d4a-6f29-4fa2-a2b8-80546afe87fd{fill:none;stroke-miterlimit:10;}.ad28f883-cd73-4be8-9f9e-d988af6477bf{stroke:#231f20;stroke-width:40px;}.aaa81a56-a3ae-4ab2-aa4f-2303b2870c66,.faa27d4a-6f29-4fa2-a2b8-80546afe87fd{stroke:#000;}.aaa81a56-a3ae-4ab2-aa4f-2303b2870c66{stroke-width:80px;}.faa27d4a-6f29-4fa2-a2b8-80546afe87fd{stroke-width:93.88px;}</style></defs><title>easyDeclare</title><g id="a7cfd0a8-4722-4b0d-a481-77f36c6d1fe2" data-name="Layer 2"><rect class="b0ab7708-516e-46f2-b750-dfd414f31224" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="ad28f883-cd73-4be8-9f9e-d988af6477bf" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><rect class="aaa81a56-a3ae-4ab2-aa4f-2303b2870c66" x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="faa27d4a-6f29-4fa2-a2b8-80546afe87fd" d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>precedence</name>
          <template>
              <description>&lt;b&gt;activity 3&lt;/b&gt; has to be preceded by &lt;b&gt;activity 2&lt;/b&gt;. &lt;b&gt;activity 3&lt;/b&gt; can happen only after &lt;b&gt;activity 2&lt;/b&gt; had happened.</description>
              <display>precedence</display>
              <name>precedence</name>
              <text> ( ! ((( "B.started" / "B.completed") / "B.cancelled" )) W "A" ) </text>
              <parameters>
                  <parameter branchable="true" id="1" name="A">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="0"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="true" id="2" name="B">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="10"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">&lt;html&gt;This constraint is satisfied because either: 
                  &lt;ul&gt;
                  &lt;li&gt;task &amp;quot;B&amp;quot; was never executed, or&lt;/li&gt;
                  &lt;li&gt;first task &amp;quot;A&amp;quot; was executed, and then task &amp;quot;B&amp;quot; was executed. &lt;/li&gt;
                  &lt;/ul&gt;&lt;/html&gt;</message>
                  <message state="VIOLATED_TEMPORARY">&lt;html&gt;This should never happen!&lt;/html&gt;</message>
                  <message state="VIOLATED">&lt;html&gt;This constraint is violated because task &amp;quot;B&amp;quot; was executed before task &amp;quot;A&amp;quot;.&lt;/html&gt;</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}
/*
*/
class AlternateResponse extends ConstraintType {
  constructor () {
    super('AlternateResponse', ['A', 'B'])
    this.icon = '<defs><style>.f18a5711-2e8b-49aa-8909-dbe21c96fcf1,.f220cd0b-db63-479f-9b5b-ad1101cbf17a{fill:#fff;}.adae8321-68eb-414e-8bf6-e5677a86bd9e,.af550190-ede1-441c-ae92-76adc88ce1a1,.ba2c0d2f-c997-4ab5-89f1-40882c830e56{fill:none;stroke-miterlimit:10;}.ba2c0d2f-c997-4ab5-89f1-40882c830e56{stroke:#231f20;stroke-width:40px;}.adae8321-68eb-414e-8bf6-e5677a86bd9e,.af550190-ede1-441c-ae92-76adc88ce1a1{stroke:#000;}.af550190-ede1-441c-ae92-76adc88ce1a1{stroke-width:80px;}.adae8321-68eb-414e-8bf6-e5677a86bd9e{stroke-width:129px;}.f18a5711-2e8b-49aa-8909-dbe21c96fcf1{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="ef0c9b62-345a-428c-b52c-0e02794e95c5" data-name="Layer 2"><rect class="f220cd0b-db63-479f-9b5b-ad1101cbf17a" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="ba2c0d2f-c997-4ab5-89f1-40882c830e56" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="527.47" y="402.05" width="195.04" height="1257.9" rx="18.96"/><rect class="af550190-ede1-441c-ae92-76adc88ce1a1" x="527.47" y="402.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1669.15,1075.23c28-23.78,28-62.68,0-86.46L1040.29,454.18c-28-23.78-50.86-13.2-50.86,23.51V1586.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="adae8321-68eb-414e-8bf6-e5677a86bd9e" d="M1669.15,1075.23c28-23.78,28-62.68,0-86.46L1040.29,454.18c-28-23.78-50.86-13.2-50.86,23.51V1586.31c0,36.71,22.89,47.29,50.86,23.51Z"/><text class="f18a5711-2e8b-49aa-8909-dbe21c96fcf1" transform="translate(1104 1168.35) scale(1.01 1)">A</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>alternate response</name>
          <template>
              <description>After each A is executed at least one B is executed. Another A can be executed again only after the first B.</description>
              <display>alternate response</display>
              <name>alternate response</name>
              <text>[]( ( "A" -&gt; X(( !("A") U "B" ))))</text>
              <parameters>
                  <parameter branchable="true" id="1" name="A">
                      <graphical>
                          <style number="2"/>
                          <begin fill="true" style="5"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="true" id="2" name="B">
                      <graphical>
                          <style number="2"/>
                          <begin fill="true" style="10"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">SATISFIED undefined</message>
                  <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
                  <message state="VIOLATED">VIOLATED undefined</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}
/*
*/
class AlternatePrecedence extends ConstraintType {
  constructor () {
    super('AlternatePrecedence', ['A', 'B'])
    this.icon = '<defs><style>.b7f92ff4-49e2-44dd-9970-37ba9c378ad6,.e8e60ee2-f12a-4c20-80a2-203cb37bfb02{fill:#fff;}.a071afe6-1b87-4253-8080-0e321ea68bd0,.ae27ece9-c4e9-4a80-b429-6438b6ae4fcb,.be613ab9-aa80-42d0-a135-dd7e31471c3d{fill:none;stroke-miterlimit:10;}.be613ab9-aa80-42d0-a135-dd7e31471c3d{stroke:#231f20;stroke-width:40px;}.a071afe6-1b87-4253-8080-0e321ea68bd0,.ae27ece9-c4e9-4a80-b429-6438b6ae4fcb{stroke:#000;}.ae27ece9-c4e9-4a80-b429-6438b6ae4fcb{stroke-width:80px;}.a071afe6-1b87-4253-8080-0e321ea68bd0{stroke-width:93.88px;}.e8e60ee2-f12a-4c20-80a2-203cb37bfb02{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="b101d1e1-8093-4c14-8c6e-5afe9202b91e" data-name="Layer 2"><rect class="b7f92ff4-49e2-44dd-9970-37ba9c378ad6" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="be613ab9-aa80-42d0-a135-dd7e31471c3d" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><rect class="ae27ece9-c4e9-4a80-b429-6438b6ae4fcb" x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="a071afe6-1b87-4253-8080-0e321ea68bd0" d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><text class="e8e60ee2-f12a-4c20-80a2-203cb37bfb02" transform="translate(522 1137.93) scale(1.01 1)">A</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>alternate precedence</name>
      <template>
        <description>B cannot happen before A. After it happens, it can not happen before the next A again.</description>
        <display>alternate precedence</display>
        <name>alternate precedence</name>
        <text>(  ( !( ( (  "B.started" /  "B.completed" ) / "B.cancelled" ) ) W "A" )   / [] ( ( "B" -&gt;  X(  ( !(  ( (  "B.started" /  "B.completed" ) / "B.cancelled" ) ) W "A" )  ) ) ) )</text>
        <parameters>
          <parameter branchable="true" id="1" name="A">
            <graphical>
              <style number="2"/>
              <begin fill="true" style="0"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
          <parameter branchable="true" id="2" name="B">
            <graphical>
              <style number="2"/>
              <begin fill="true" style="10"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
        </parameters>
        <statemessages>
          <message state="SATISFIED">SATISFIED undefined</message>
          <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
          <message state="VIOLATED">VIOLATED undefined</message>
        </statemessages>
      </template>
      <constraintparameters>
        <parameter templateparameter="1">
          <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
          </branches>
        </parameter>
        <parameter templateparameter="2">
          <branches>
              <branch id="${targetId}" name="${targetName}"/>
          </branches>
        </parameter>
      </constraintparameters>
    </constraint>
      `
  }
}
/*
*/
class ChainResponse extends ConstraintType {
  constructor () {
    super('ChainResponse', ['A', 'B'])
    this.icon = '<defs><style>.a74e4c81-c2e3-4671-9768-a3a83cf25599,.b98aa88a-aba9-4ff7-8f47-259ba8cd6139{fill:#fff;}.a1fb650a-b6b7-4a12-9a80-c1c615d9b881,.ac5bbe2a-d7cf-4608-9a34-24541027878e,.ad7c1640-da06-4635-bf26-6666bd36c2a0{fill:none;stroke-miterlimit:10;}.a1fb650a-b6b7-4a12-9a80-c1c615d9b881{stroke:#231f20;stroke-width:40px;}.ac5bbe2a-d7cf-4608-9a34-24541027878e,.ad7c1640-da06-4635-bf26-6666bd36c2a0{stroke:#000;}.ad7c1640-da06-4635-bf26-6666bd36c2a0{stroke-width:80px;}.ac5bbe2a-d7cf-4608-9a34-24541027878e{stroke-width:129px;}.a74e4c81-c2e3-4671-9768-a3a83cf25599{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="ec9030d4-2b0b-42bd-a968-69799e8c9c8a" data-name="Layer 2"><rect class="b98aa88a-aba9-4ff7-8f47-259ba8cd6139" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="a1fb650a-b6b7-4a12-9a80-c1c615d9b881" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="536.97" y="402.05" width="195.04" height="1257.9" rx="18.96"/><rect class="ad7c1640-da06-4635-bf26-6666bd36c2a0" x="536.97" y="402.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1678.65,1075.23c28-23.78,28-62.68,0-86.46L1049.79,454.18c-28-23.78-50.86-13.2-50.86,23.51V1586.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="ac5bbe2a-d7cf-4608-9a34-24541027878e" d="M1678.65,1075.23c28-23.78,28-62.68,0-86.46L1049.79,454.18c-28-23.78-50.86-13.2-50.86,23.51V1586.31c0,36.71,22.89,47.29,50.86,23.51Z"/><text class="a74e4c81-c2e3-4671-9768-a3a83cf25599" transform="translate(1088.5 1178.35) scale(1.01 1)">C</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>chain response</name>
      <template>
        <description>After A the  next one has to be B.</description>
        <display>chain response</display>
        <name>chain response</name>
        <text>[] ( ( "A"  -&gt; X( "B.started" ) ) )</text>
        <parameters>
          <parameter branchable="false" id="1" name="A">
            <graphical>
              <style number="3"/>
              <begin fill="true" style="5"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
          <parameter branchable="false" id="2" name="B">
            <graphical>
              <style number="3"/>
              <begin fill="true" style="2"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
        </parameters>
        <statemessages>
          <message state="SATISFIED">SATISFIED undefined</message>
          <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
          <message state="VIOLATED">VIOLATED undefined</message>
        </statemessages>
      </template>
      <constraintparameters>
        <parameter templateparameter="1">
          <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
          </branches>
        </parameter>
        <parameter templateparameter="2">
          <branches>
                          <branch id="${targetId}" name="${targetName}"/>
          </branches>
        </parameter>
      </constraintparameters>
    </constraint>
      `
  }
}
/*
*/
class ChainPrecedence extends ConstraintType {
  constructor () {
    super('ChainPrecedence', ['A', 'B'])
    this.icon = '<defs><style>.a3b61175-1763-4080-9204-f49546dd0a6d,.f00485db-189d-4b3b-8871-78e0034c0efe{fill:#fff;}.a82dbef9-7d03-4316-a721-2ba4ec5590a2,.abbab66b-e053-48bb-b3d9-cc79ae902b3c,.abc1a53c-2332-4d61-9f3c-d7399c577a86{fill:none;stroke-miterlimit:10;}.a82dbef9-7d03-4316-a721-2ba4ec5590a2{stroke:#231f20;stroke-width:40px;}.abbab66b-e053-48bb-b3d9-cc79ae902b3c,.abc1a53c-2332-4d61-9f3c-d7399c577a86{stroke:#000;}.abc1a53c-2332-4d61-9f3c-d7399c577a86{stroke-width:80px;}.abbab66b-e053-48bb-b3d9-cc79ae902b3c{stroke-width:93.88px;}.a3b61175-1763-4080-9204-f49546dd0a6d{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="e0b58d51-b315-4db2-b793-794128d5b8dd" data-name="Layer 2"><rect class="f00485db-189d-4b3b-8871-78e0034c0efe" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="a82dbef9-7d03-4316-a721-2ba4ec5590a2" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><rect class="abc1a53c-2332-4d61-9f3c-d7399c577a86" x="1323.99" y="372.05" width="195.04" height="1257.9" rx="18.96"/><path d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><path class="abbab66b-e053-48bb-b3d9-cc79ae902b3c" d="M1091.21,1043.23c28-23.78,28-62.68,0-86.46L462.36,422.18c-28-23.78-50.86-13.2-50.86,23.51V1554.31c0,36.71,22.89,47.29,50.86,23.51Z"/><text class="a3b61175-1763-4080-9204-f49546dd0a6d" transform="translate(520 1137.93) scale(1.01 1)">C</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>chain precedence</name>
      <template>
        <description>B can be executed only directly after A.</description>
        <display>chain precedence</display>
        <name>chain precedence</name>
        <text>[]( ( X( "B.started" ) -&gt; "A") )</text>
        <parameters>
          <parameter branchable="true" id="1" name="A">
            <graphical>
              <style number="3"/>
              <begin fill="false" style="0"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
          <parameter branchable="true" id="2" name="B">
            <graphical>
              <style number="3"/>
              <begin fill="true" style="10"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
        </parameters>
        <statemessages>
          <message state="SATISFIED">SATISFIED undefined</message>
          <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
          <message state="VIOLATED">VIOLATED undefined</message>
        </statemessages>
      </template>
      <constraintparameters>
        <parameter templateparameter="1">
          <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
          </branches>
        </parameter>
        <parameter templateparameter="2">
          <branches>
                          <branch id="${targetId}" name="${targetName}"/>
          </branches>
        </parameter>
      </constraintparameters>
    </constraint>
      `
  }
}
/*
*/
class RespondedExistence extends ConstraintType {
  constructor () {
    super('RespondedExistence', ['A', 'B'])
    this.icon = '<defs><style>.b20585f1-6a8e-4310-a78d-ef9cc624e0ff{fill:#fff;}.a6517f78-fd42-4c8c-a328-83c1ae5be33e,.f8ca5f79-65e8-4a59-b5a8-06bc65fc621d{fill:none;stroke-miterlimit:10;}.a6517f78-fd42-4c8c-a328-83c1ae5be33e{stroke:#231f20;stroke-width:40px;}.f8ca5f79-65e8-4a59-b5a8-06bc65fc621d{stroke:#000;stroke-width:80px;}</style></defs><title>easyDeclare</title><g id="e90ede65-244f-4ae6-a200-13a9cb76a90c" data-name="Layer 2"><rect class="b20585f1-6a8e-4310-a78d-ef9cc624e0ff" x="52" y="52" width="1896" height="1896" rx="224.3"/><rect class="a6517f78-fd42-4c8c-a328-83c1ae5be33e" x="52" y="52" width="1896" height="1896" rx="224.3"/><rect x="650.47" y="371.05" width="195.04" height="1257.9" rx="18.96"/><rect class="f8ca5f79-65e8-4a59-b5a8-06bc65fc621d" x="650.47" y="371.05" width="195.04" height="1257.9" rx="18.96"/><rect x="1219.27" y="634.76" width="195.04" height="730.48" rx="18.96"/><rect class="f8ca5f79-65e8-4a59-b5a8-06bc65fc621d" x="1219.27" y="634.76" width="195.04" height="730.48" rx="18.96"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>responded existence</name>
      <template>
        <description>If A happen (at least once) then B has to have (at least once) happpend before of has to happen after A. </description>
        <display>responded existence</display>
        <name>responded existence</name>
        <text>( &lt;&gt;("A") -&gt; &lt;&gt;( "B" ) )</text>
        <parameters>
          <parameter branchable="true" id="1" name="A">
            <graphical>
              <style number="1"/>
              <begin fill="true" style="5"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
          <parameter branchable="true" id="2" name="B">
            <graphical>
              <style number="1"/>
              <begin fill="false" style="0"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
        </parameters>
        <statemessages>
          <message state="SATISFIED">SATISFIED undefined</message>
          <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
          <message state="VIOLATED">VIOLATED undefined</message>
        </statemessages>
      </template>
      <constraintparameters>
        <parameter templateparameter="1">
          <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
          </branches>
        </parameter>
        <parameter templateparameter="2">
          <branches>
                          <branch id="${targetId}" name="${targetName}"/>
          </branches>
        </parameter>
      </constraintparameters>
    </constraint>
      `
  }
}
/*
*/
class CoExistence extends ConstraintType {
  constructor () {
    super('CoExistence', ['A', 'B'])
    this.icon = '<defs><style>.fcdd7d8b-7568-4168-9d80-95f90b7ae3ee{fill:#fff;}.b9a4f273-2fc2-455b-9d32-6d854b333c14,.bea711f1-49fb-401c-91ee-21a1a2d17f8b{fill:none;stroke-miterlimit:10;}.bea711f1-49fb-401c-91ee-21a1a2d17f8b{stroke:#231f20;stroke-width:40px;}.b9a4f273-2fc2-455b-9d32-6d854b333c14{stroke:#000;stroke-width:80px;}</style></defs><title>easyDeclare</title><g id="adec83a4-1d31-4c3c-87e7-24f1e9274b60" data-name="Layer 2"><rect class="fcdd7d8b-7568-4168-9d80-95f90b7ae3ee" x="52" y="52" width="1896" height="1896" rx="224.3"/><rect class="bea711f1-49fb-401c-91ee-21a1a2d17f8b" x="52" y="52" width="1896" height="1896" rx="224.3"/><rect x="618.08" y="371.05" width="195.04" height="1257.9" rx="18.96"/><rect class="b9a4f273-2fc2-455b-9d32-6d854b333c14" x="618.08" y="371.05" width="195.04" height="1257.9" rx="18.96"/><rect x="1186.88" y="371.05" width="195.04" height="1257.9" rx="18.96"/><rect class="b9a4f273-2fc2-455b-9d32-6d854b333c14" x="1186.88" y="371.05" width="195.04" height="1257.9" rx="18.96"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>co-existence</name>
          <template>
              <description>If A happen (at least once) then B has to have (at least once) happpend before of has to happen after A. And vice versa.</description>
              <display>co-existence</display>
              <name>co-existence</name>
              <text>( ( &lt;&gt;("A") -&gt; &lt;&gt;( "B" ) ) / ( &lt;&gt;("B") -&gt; &lt;&gt;( "A" ) )  )</text>
              <parameters>
                  <parameter branchable="true" id="1" name="A">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="5"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="true" id="2" name="B">
                      <graphical>
                          <style number="1"/>
                          <begin fill="true" style="5"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">SATISFIED undefined</message>
                  <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
                  <message state="VIOLATED">VIOLATED undefined</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}
/*
*/
class Succession extends ConstraintType {
  constructor () {
    super('Succession', ['A', 'B'])
    this.icon = '<defs><style>.add3e85e-0297-462b-b5c5-901e5bcef116{fill:#fff;}.fa2fd5b0-6b2d-4178-b72d-c232e57e0252,.fd9e0434-8351-45b2-8689-dd71e7199647{fill:none;stroke-miterlimit:10;}.fd9e0434-8351-45b2-8689-dd71e7199647{stroke:#231f20;stroke-width:40px;}.fa2fd5b0-6b2d-4178-b72d-c232e57e0252{stroke:#000;stroke-width:80px;}</style></defs><title>easyDeclare</title><g id="af64f38b-81d7-4442-8700-7ebf69ab3326" data-name="Layer 2"><rect class="add3e85e-0297-462b-b5c5-901e5bcef116" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="fd9e0434-8351-45b2-8689-dd71e7199647" x="52" y="52" width="1896" height="1896" rx="189.6"/><path d="M1312.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L776.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><path class="fa2fd5b0-6b2d-4178-b72d-c232e57e0252" d="M1312.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L776.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><rect x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="fa2fd5b0-6b2d-4178-b72d-c232e57e0252" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="fa2fd5b0-6b2d-4178-b72d-c232e57e0252" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>succession</name>
      <template>
        <description>response and precedence:
                      1. After every &lt;b&gt;activity 9&lt;/b&gt; there has to be at least one &lt;b&gt;activity 10&lt;/b&gt;.
                      and
                      2. &lt;b&gt;activity 10&lt;/b&gt; has to be preceded by &lt;b&gt;activity 9&lt;/b&gt;. &lt;b&gt;activity 10&lt;/b&gt; can happen only after &lt;b&gt;activity 9&lt;/b&gt; had happened.</description>
        <display>succession</display>
        <name>succession</name>
        <text>( []( ( "A" -&gt; &lt;&gt;( "B" ) ) ) /  ( !( (( "B.started" / "B.completed") / "B.cancelled" ) ) W "A" )   )</text>
        <parameters>
          <parameter branchable="true" id="1" name="A">
            <graphical>
              <style number="1"/>
              <begin fill="true" style="5"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
          <parameter branchable="true" id="2" name="B">
            <graphical>
              <style number="1"/>
              <begin fill="true" style="10"/>
              <middle fill="false" style="0"/>
              <end fill="false" style="0"/>
            </graphical>
          </parameter>
        </parameters>
        <statemessages>
          <message state="SATISFIED">&lt;html&gt;SATISFIED undefined&lt;/html&gt;</message>
          <message state="VIOLATED_TEMPORARY">&lt;html&gt;VIOLATED_TEMPORARY undefined&lt;/html&gt;</message>
          <message state="VIOLATED">&lt;html&gt;VIOLATED undefined&lt;/html&gt;</message>
        </statemessages>
      </template>
      <constraintparameters>
        <parameter templateparameter="1">
          <branches>
                          <branch id="${sourceId}" name="${sourceName}"/>
          </branches>
        </parameter>
        <parameter templateparameter="2">
          <branches>
                          <branch id="${targetId}" name="${targetName}"/>
          </branches>
        </parameter>
      </constraintparameters>
    </constraint>
      `
  }
}
/*
*/
class ChainSuccession extends ConstraintType {
  constructor () {
    super('ChainSuccession', ['A', 'B'])
    this.icon = '<defs><style>.a7bc3507-6b1e-4751-88cf-300f22b3d0b0,.b4740027-9368-4946-aa89-f3de60d39f32{fill:#fff;}.bbf3b8b1-5fd5-43e2-ab4d-c59bdb9c1b05,.bfcfd4f0-5a11-4f6e-a09a-5a5f6f908de1{fill:none;stroke-miterlimit:10;}.bfcfd4f0-5a11-4f6e-a09a-5a5f6f908de1{stroke:#231f20;stroke-width:40px;}.bbf3b8b1-5fd5-43e2-ab4d-c59bdb9c1b05{stroke:#000;stroke-width:80px;}.a7bc3507-6b1e-4751-88cf-300f22b3d0b0{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="f1128e03-ce16-483f-a3d9-dd47729a268b" data-name="Layer 2"><rect class="b4740027-9368-4946-aa89-f3de60d39f32" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="bfcfd4f0-5a11-4f6e-a09a-5a5f6f908de1" x="52" y="52" width="1896" height="1896" rx="189.6"/><path d="M1322.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L786.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><path class="bbf3b8b1-5fd5-43e2-ab4d-c59bdb9c1b05" d="M1322.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L786.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><rect x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="bbf3b8b1-5fd5-43e2-ab4d-c59bdb9c1b05" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="bbf3b8b1-5fd5-43e2-ab4d-c59bdb9c1b05" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><text class="a7bc3507-6b1e-4751-88cf-300f22b3d0b0" transform="translate(781 1190.35) scale(1.01 1)">C</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>chain succession</name>
      <template>
          <description>A and B can happen only next to each other.</description>
          <display>chain succession</display>
          <name>chain succession</name>
          <text>[](  ( "A" = X( "B.started" ) )  )</text>
          <parameters>
              <parameter branchable="true" id="1" name="A">
                  <graphical>
                      <style number="3"/>
                      <begin fill="true" style="5"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
              <parameter branchable="true" id="2" name="B">
                  <graphical>
                      <style number="3"/>
                      <begin fill="true" style="10"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
          </parameters>
          <statemessages>
              <message state="SATISFIED">SATISFIED undefined</message>
              <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
              <message state="VIOLATED">VIOLATED undefined</message>
          </statemessages>
      </template>
      <constraintparameters>
          <parameter templateparameter="1">
              <branches>
                  <branch id="${sourceId}" name="${sourceName}"/>
              </branches>
          </parameter>
          <parameter templateparameter="2">
              <branches>
                  <branch id="${targetId}" name="${targetName}"/>
              </branches>
          </parameter>
      </constraintparameters>
  </constraint>
      `
  }
}
/*
*/
class AlternateSuccession extends ConstraintType {
  constructor () {
    super('AlternateSuccession', ['A', 'B'])
    this.icon = '<defs><style>.bcfbf0ff-53e2-42d0-b9d1-187d61675f65,.f17e4939-b3cd-4fe0-bf42-1349e97302fb{fill:#fff;}.b32acbf8-6587-4656-9031-21c68a483e0a,.e280ac34-0135-4eeb-bf96-7579d9bdabcb{fill:none;stroke-miterlimit:10;}.b32acbf8-6587-4656-9031-21c68a483e0a{stroke:#231f20;stroke-width:40px;}.e280ac34-0135-4eeb-bf96-7579d9bdabcb{stroke:#000;stroke-width:80px;}.bcfbf0ff-53e2-42d0-b9d1-187d61675f65{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="b0e43844-4ba6-485d-8479-9bebea3ffb31" data-name="Layer 2"><rect class="f17e4939-b3cd-4fe0-bf42-1349e97302fb" x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="b32acbf8-6587-4656-9031-21c68a483e0a" x="52" y="52" width="1896" height="1896" rx="189.6"/><path d="M1322.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L786.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><path class="e280ac34-0135-4eeb-bf96-7579d9bdabcb" d="M1322.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L786.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><rect x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="e280ac34-0135-4eeb-bf96-7579d9bdabcb" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="e280ac34-0135-4eeb-bf96-7579d9bdabcb" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><text class="bcfbf0ff-53e2-42d0-b9d1-187d61675f65" transform="translate(811.5 1179.35) scale(1.01 1)">A</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>alternate succession</name>
      <template>
          <description>Alternate response and alternate precedence:
          1. After each A is executed at least one B is executed. Another A can be executed again only after the first B.
          and
          2. B cannot happen before A. After it happens, it can not happen before the next A again.</description>
          <display>alternate succession</display>
          <name>alternate succession</name>
          <text>( []( (  "A"  -&gt; X(( ! (  "A" ) U  "B" ) )) ) /  (  ( ! (  "B" ) W  "A"  ) / [] ( ( "B" -&gt;  X( ( ! (   "B" ) W  "A"  )) ) ) ) )</text>
          <parameters>
              <parameter branchable="true" id="1" name="A">
                  <graphical>
                      <style number="2"/>
                      <begin fill="true" style="5"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
              <parameter branchable="true" id="2" name="B">
                  <graphical>
                      <style number="2"/>
                      <begin fill="true" style="10"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
          </parameters>
          <statemessages>
              <message state="SATISFIED">SATISFIED undefined</message>
              <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
              <message state="VIOLATED">VIOLATED undefined</message>
          </statemessages>
      </template>
      <constraintparameters>
          <parameter templateparameter="1">
              <branches>
                  <branch id="${sourceId}" name="${sourceName}"/>
              </branches>
          </parameter>
          <parameter templateparameter="2">
              <branches>
                  <branch id="${targetId}" name="${targetName}"/>
              </branches>
          </parameter>
      </constraintparameters>
  </constraint>
      `
  }
}
/*
*/
class NotCoExistence extends ConstraintType {
  constructor () {
    super('NotCoExistence', ['A', 'B'])
    this.icon = '<defs><style>.ab35c248-cfb4-4925-87ef-293a7c9bfaee,.ea08763e-88e8-4fb6-a37f-4d7c57eac196{fill:none;stroke:#fff;stroke-miterlimit:10;}.ea08763e-88e8-4fb6-a37f-4d7c57eac196{stroke-width:40px;}.afa8cf3f-a1df-4fe8-8c2c-4bd085627c90{fill:#fff;}.ab35c248-cfb4-4925-87ef-293a7c9bfaee{stroke-width:80px;}</style></defs><title>easyDeclare</title><g id="ac360733-5136-4a77-b281-5936bfeb9f2f" data-name="Layer 2"><rect x="62.62" y="74.13" width="1896" height="1896" rx="224.3"/><rect class="ea08763e-88e8-4fb6-a37f-4d7c57eac196" x="62.62" y="74.13" width="1896" height="1896" rx="224.3"/><rect class="afa8cf3f-a1df-4fe8-8c2c-4bd085627c90" x="628.71" y="393.18" width="195.04" height="1257.9" rx="18.96"/><rect class="ab35c248-cfb4-4925-87ef-293a7c9bfaee" x="628.71" y="393.18" width="195.04" height="1257.9" rx="18.96"/><rect class="afa8cf3f-a1df-4fe8-8c2c-4bd085627c90" x="1197.51" y="393.18" width="195.04" height="1257.9" rx="18.96"/><rect class="ab35c248-cfb4-4925-87ef-293a7c9bfaee" x="1197.51" y="393.18" width="195.04" height="1257.9" rx="18.96"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>not co-existence</name>
      <template>
          <description>Only one of the two tasks &lt;b&gt;activity 12&lt;/b&gt; or &lt;b&gt;activity 13&lt;/b&gt; can be executed, but not both.</description>
          <display>not co-existence</display>
          <name>not co-existence</name>
          <text>!( ( &lt;&gt;( "A.completed" ) / &lt;&gt;(  "B.completed" ) ) )</text>
          <parameters>
              <parameter branchable="false" id="1" name="A">
                  <graphical>
                      <style number="1"/>
                      <begin fill="true" style="5"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="8"/>
                  </graphical>
              </parameter>
              <parameter branchable="false" id="2" name="B">
                  <graphical>
                      <style number="1"/>
                      <begin fill="true" style="5"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
          </parameters>
          <statemessages>
              <message state="SATISFIED">&lt;html&gt;This constraint is satisfied because either:&lt;ul&gt;
&lt;li&gt;none of the tasks &amp;quot;A&amp;quot; and &amp;quot;B&amp;quot; were executed, or&lt;/li&gt;
&lt;li&gt;task &amp;quot;A&amp;quot; was executed and task &amp;quot;B&amp;quot; not, or&lt;/li&gt;
&lt;li&gt;task &amp;quot;B&amp;quot; was executed and task &amp;quot;A&amp;quot; not.&lt;/li&gt;&lt;/html&gt;</message>
              <message state="VIOLATED_TEMPORARY">&lt;html&gt;This should never happen.&lt;/html&gt;</message>
              <message state="VIOLATED">&lt;html&gt;This constraint is violated because both tasks &amp;quot;A&amp;quot; and &amp;quot;B&amp;quot; were executed.&lt;/html&gt;</message>
          </statemessages>
      </template>
      <constraintparameters>
          <parameter templateparameter="1">
              <branches>
                  <branch id="${sourceId}" name="${sourceName}"/>
              </branches>
          </parameter>
          <parameter templateparameter="2">
              <branches>
                  <branch id="${targetId}" name="${targetName}"/>
              </branches>
          </parameter>
      </constraintparameters>
  </constraint>
      `
  }
}
/*
*/
class NotSuccession extends ConstraintType {
  constructor () {
    super('NotSuccession', ['A', 'B'])
    this.icon = '<defs><style>.a0482525-7c06-4447-ac77-08209ffe8949,.fcd93442-71b6-4640-8c2a-08e690a46fbe{fill:none;stroke-miterlimit:10;}.fcd93442-71b6-4640-8c2a-08e690a46fbe{stroke:#000;stroke-width:40px;}.e66f6028-710b-41eb-8f56-642f973dd92c{fill:#fff;}.a0482525-7c06-4447-ac77-08209ffe8949{stroke:#fff;stroke-width:80px;}</style></defs><title>easyDeclare</title><g id="afd33428-be0a-4855-9580-ebaaef26f786" data-name="Layer 2"><rect x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="fcd93442-71b6-4640-8c2a-08e690a46fbe" x="52" y="52" width="1896" height="1896" rx="189.6"/><path class="e66f6028-710b-41eb-8f56-642f973dd92c" d="M1342.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L806.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><path class="a0482525-7c06-4447-ac77-08209ffe8949" d="M1342.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L806.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><rect class="e66f6028-710b-41eb-8f56-642f973dd92c" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="a0482525-7c06-4447-ac77-08209ffe8949" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="e66f6028-710b-41eb-8f56-642f973dd92c" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="a0482525-7c06-4447-ac77-08209ffe8949" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
      <condition/>
      <name>not succession</name>
      <template>
          <description>Before B there cannot be A and after A there cannot be B.</description>
          <display>not succession</display>
          <name>not succession</name>
          <text>[]( ( "A" -&gt; !( &lt;&gt;( "B" ) ) ) )</text>
          <parameters>
              <parameter branchable="false" id="1" name="A">
                  <graphical>
                      <style number="1"/>
                      <begin fill="true" style="5"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="8"/>
                  </graphical>
              </parameter>
              <parameter branchable="true" id="2" name="B">
                  <graphical>
                      <style number="1"/>
                      <begin fill="true" style="10"/>
                      <middle fill="false" style="0"/>
                      <end fill="false" style="0"/>
                  </graphical>
              </parameter>
          </parameters>
          <statemessages>
              <message state="SATISFIED">SATISFIED undefined</message>
              <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
              <message state="VIOLATED">VIOLATED undefined</message>
          </statemessages>
      </template>
      <constraintparameters>
          <parameter templateparameter="1">
              <branches>
                  <branch id="${sourceId}" name="${sourceName}"/>
              </branches>
          </parameter>
          <parameter templateparameter="2">
              <branches>
                  <branch id="${targetId}" name="${targetName}"/>
              </branches>
          </parameter>
      </constraintparameters>
  </constraint>
      `
  }
}
/*
*/
class NotChainSuccession extends ConstraintType {
  constructor () {
    super('NotChainSuccession', ['A', 'B'])
    this.icon = '<defs><style>.b42f206c-9a94-4fd1-864b-a85ae68ebdd7,.e21c11d8-f011-48d7-9e6d-7c7f29588ef8{fill:none;stroke-miterlimit:10;}.e21c11d8-f011-48d7-9e6d-7c7f29588ef8{stroke:#000;stroke-width:40px;}.b36f2059-7f23-4e31-8480-41cd20c27d10{fill:#fff;}.b42f206c-9a94-4fd1-864b-a85ae68ebdd7{stroke:#fff;stroke-width:80px;}.e76f7b2f-4c6f-4591-ae5e-77bbdd1cd3a1{font-size:480px;font-family:OpenSans-SemiBold, Open Sans SemiBold;font-weight:600;}</style></defs><title>easyDeclare</title><g id="e925acbf-6d3a-4307-8e04-6aee74bcf158" data-name="Layer 2"><rect x="52" y="52" width="1896" height="1896" rx="189.6"/><rect class="e21c11d8-f011-48d7-9e6d-7c7f29588ef8" x="52" y="52" width="1896" height="1896" rx="189.6"/><path class="b36f2059-7f23-4e31-8480-41cd20c27d10" d="M1342.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L806.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><path class="b42f206c-9a94-4fd1-864b-a85ae68ebdd7" d="M1342.23,1036.84c23.84-20.26,23.84-53.42,0-73.68L806.34,507.6c-23.84-20.27-43.34-11.25-43.34,20v944.72c0,31.29,19.5,40.31,43.34,20Z"/><rect class="b36f2059-7f23-4e31-8480-41cd20c27d10" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="b42f206c-9a94-4fd1-864b-a85ae68ebdd7" x="254.04" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="b36f2059-7f23-4e31-8480-41cd20c27d10" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><rect class="b42f206c-9a94-4fd1-864b-a85ae68ebdd7" x="1548.62" y="476.36" width="162.38" height="1047.28" rx="18.96"/><text class="e76f7b2f-4c6f-4591-ae5e-77bbdd1cd3a1" transform="translate(781 1190.35) scale(1.01 1)">C</text></g>'
  }

  getXML (id, sourceId, sourceName, targetId, targetName) {
    return `
      <constraint id="${id}" mandatory="true">
          <condition/>
          <name>not chain succession</name>
          <template>
              <description>A and be cann ever be executed next to each other where A if executed first and B second.</description>
              <display>not chain succession</display>
              <name>not chain succession</name>
              <text>[]( ( "A" -&gt; X( !( "B" ) ) ) )</text>
              <parameters>
                  <parameter branchable="false" id="1" name="A">
                      <graphical>
                          <style number="3"/>
                          <begin fill="true" style="5"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="8"/>
                      </graphical>
                  </parameter>
                  <parameter branchable="false" id="2" name="B">
                      <graphical>
                          <style number="3"/>
                          <begin fill="true" style="10"/>
                          <middle fill="false" style="0"/>
                          <end fill="false" style="0"/>
                      </graphical>
                  </parameter>
              </parameters>
              <statemessages>
                  <message state="SATISFIED">SATISFIED undefined</message>
                  <message state="VIOLATED_TEMPORARY">VIOLATED_TEMPORARY undefined</message>
                  <message state="VIOLATED">VIOLATED undefined</message>
              </statemessages>
          </template>
          <constraintparameters>
              <parameter templateparameter="1">
                  <branches>
                      <branch id="${sourceId}" name="${sourceName}"/>
                  </branches>
              </parameter>
              <parameter templateparameter="2">
                  <branches>
                      <branch id="${targetId}" name="${targetName}"/>
                  </branches>
              </parameter>
          </constraintparameters>
      </constraint>
      `
  }
}

const constraintTypes = {
  'Activity Role': {
    Init,
    End
  },
  'Activity Existence': {
    Existence,
    Absence
  },
  'Choice Relation': {
    Choice,
    ExclusiveChoice
  },
  Relation: {
    Response,
    Precedence,
    AlternateResponse,
    AlternatePrecedence,
    ChainResponse,
    ChainPrecedence,
    RespondedExistence
  },
  'Mutual Relation': {
    CoExistence,
    Succession,
    ChainSuccession,
    AlternateSuccession
  },
  'Negative Relation': {
    NotCoExistence,
    NotSuccession,
    NotChainSuccession
  }
}

export default constraintTypes

export function getConstraintType (name) {
  if (name instanceof ConstraintType) return name

  for (const classKey in constraintTypes) {
    for (const nameKey in constraintTypes[classKey]) {
      const c = new constraintTypes[classKey][nameKey]()
      if (c.name === name) return c
    }
  }
  throw new Error(`Searched for a constraint name '${name}' that does not exist.`)
}
