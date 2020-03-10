grammar aiJson;

startrule : node EOF;

node        : condition | actionblock;

condition   : LBR CONDITION SC conditiondata RBR ;
conditiondata : LBR type_id COM childtrue COM childfalse COM attributes COM position RBR ;
childtrue   : CHILDTRUE SC node ;
childfalse  : CHILDFALSE SC node ;


actionblock : LBR ACTIONBLOCK SC actiondata RBR ;
actiondata  : LBR ACTIONLIST SC actionlist COM position RBR ;
actionlist  : LB (action (COM action)*)? RB ;
action      : LBR type_id COM attributes RBR;


attributes          : ATTRIBUTES SC attributevalues ;
attributevalues     : LBR (attributevalue (COM attributevalue)*)? RBR ;
attributevalue      : APHSTRING SC value;
value               : APHSTRING | INTEGER;

position        : POSITION SC positiondata ;
positiondata    : LBR X SC INTEGER COM Y SC INTEGER RBR ;

type_id     : TYPE_ID SC INTEGER ;





ROOT        : APH 'root' APH ;
CONDITION   : APH 'condition' APH ;

CHILDTRUE   : APH 'child-true' APH ;
CHILDFALSE  : APH 'child-false' APH ;

ACTIONBLOCK : APH 'actionblock' APH ;
ACTIONLIST  : APH 'actionlist' APH ;

ATTRIBUTES  : APH 'attributes' APH ;

POSITION    : APH 'position' APH ;
X           : APH 'x' APH ;
Y           : APH 'y' APH ;

TYPE_ID     : APH 'type-id' APH ;

APHSTRING   : APH STRING APH ;





INTEGER : DIGIT+ ;
STRING : ALPHANUMERIC+ ;
ALPHANUMERIC : CHAR | DIGIT ;


CHAR : [a-zA-Z] ;
DIGIT  : [0-9];

APH : '"';
COM : ',';
SC  : ':';
LBR : '{';
RBR : '}';
LB : '[';
RB : ']';

WS : [ \t\n]+ -> skip;
